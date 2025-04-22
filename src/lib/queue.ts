import Bull from "bull";

export const analysisQueue = new Bull("analysis", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});
