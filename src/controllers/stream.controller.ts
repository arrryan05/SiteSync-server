import { Request, Response } from "express";
import { StreamService } from "../services/stream.service";

export const projectStreamController = (req: Request, res: Response) => {
  const { projectId } = req.params;
  console.log("Inside SSE controller")

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("\n");

  const onMessage = (_channel: string, message: string) => {
    res.write(`event: analysisUpdate\n`);
    res.write(`data: ${message}\n\n`);
  };

  const channel = StreamService.subscribe(projectId, onMessage);

  req.on("close", () => {
    StreamService.unsubscribe(channel, onMessage);
    res.end();
  });
};
