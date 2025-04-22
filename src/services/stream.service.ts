import Redis from "ioredis";

const redisSub = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

export class StreamService {
  static subscribe(
    projectId: string,
    onMessage: (channel: string, message: string) => void
  ) {
    const channel = `project:${projectId}`;
    // Subscribe if not already subscribed
    redisSub.subscribe(channel, (err, count) => {
      if (err) {
        console.error(`Failed to subscribe to ${channel}:`, err);
      }
    });
    redisSub.on("message", onMessage);
    return channel;
  }

  static unsubscribe(
    channel: string,
    onMessage: (channel: string, message: string) => void
  ) {
    redisSub.off("message", onMessage);
    redisSub.unsubscribe(channel, (err, count) => {
      if (err) {
        console.error(`Failed to unsubscribe from ${channel}:`, err);
      }
    });
  }
}
