import { Router } from "express";
import { rerunAnalysisController } from "../controllers/analysis.controller";
import { verifyToken } from "../utils/jwt.util";
import { pinpointAnalysisController } from "../controllers/test.controller";

const router = Router();

// router.post('/analyze', analyzeWebsiteEndpoint);
router.post("/rerun", verifyToken, rerunAnalysisController);
router.post(
    "/pinpoint",
    pinpointAnalysisController
  );
  

export default router;
