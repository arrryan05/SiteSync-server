import { Router } from 'express';
import { analyzeWebsiteEndpoint, rerunAnalysisController } from '../controllers/analysis.controller';
import { verifyToken } from '../utils/jwt.util';

const router = Router();

router.post('/analyze', analyzeWebsiteEndpoint);
router.post("/rerun", verifyToken, rerunAnalysisController);


export default router;