import { Router } from "express";
import { projectStreamController } from "../controllers/stream.controller";
import { verifySseToken } from "../middlerware/verifySSEtoken";

const router = Router();

// SSE stream endpoint
router.get("/projects/:projectId/stream", verifySseToken , projectStreamController);

export default router;
