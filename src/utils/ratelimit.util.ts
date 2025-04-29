// src/utils/ratelimit.util.ts
/**
 * Run tasks with a fixed concurrency.
 */
export async function runWithConcurrency<T, R>(
  tasks: T[],
  concurrency: number,
  taskFn: (task: T) => Promise<R>
): Promise<(R | null)[]> {
  const results: (R | null)[] = [];
  let index = 0;
  async function worker() {
    while (index < tasks.length) {
      const i = index++;
      try {
        results[i] = await taskFn(tasks[i]);
      } catch (err) {
        console.error(`Task ${i} failed:`, err);
        results[i] = null;
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

/**
 * Retry a promise-returning fn on 429 errors (or other transient errors).
 */
export async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  baseDelayMs: number = 1000,
  jitter: boolean = true
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      const msg = err?.message ?? "";
      // Retry if it's a 429 (RESOURCE_EXHAUSTED) from Gemini
      if (
        attempt < maxRetries &&
        (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED"))
      ) {
        attempt++;
        const exp = baseDelayMs * 2 ** (attempt - 1);
        const delay = jitter
          ? exp * (0.8 + Math.random() * 0.4)
          : exp;
        console.warn(
          `Retry #${attempt} in ${Math.round(delay)} ms after: ${msg}`
        );
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
}
