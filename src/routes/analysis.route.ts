import { Router } from 'express';
import { analyzeWebsiteEndpoint } from '../controllers/analysis.controller';

const router = Router();

router.post('/analyze', analyzeWebsiteEndpoint);

export default router;