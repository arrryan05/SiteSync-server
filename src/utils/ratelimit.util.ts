export async function runWithConcurrency<T, R>(
    tasks: T[],
    concurrency: number,
    taskFn: (task: T) => Promise<R>
  ): Promise<R[]> {
    const results: R[] = [];
    let index = 0;
  
    async function worker() {
      while (index < tasks.length) {
        const currentIndex = index++;
        try {
          const result = await taskFn(tasks[currentIndex]);
          results[currentIndex] = result;
        } catch (error) {
          console.error(`Task failed at index ${currentIndex}:`, error);
          results[currentIndex] = null as any;
        }
      }
    }
  
    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);
    return results;
  }
  