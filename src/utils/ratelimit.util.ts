export async function runWithConcurrency<T>(
    tasks: (() => Promise<T>)[],
    concurrency: number
  ): Promise<T[]> {
    const results: T[] = [];
    let index = 0;
  
    const workers = new Array(concurrency).fill(null).map(async () => {
      while (index < tasks.length) {
        const currentIndex = index++;
        try {
          results[currentIndex] = await tasks[currentIndex]();
        } catch (err) {
          throw err;
        }
      }
    });
  
    await Promise.all(workers);
    return results;
  }
  