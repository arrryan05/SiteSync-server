import { Request, Response } from 'express';
import { analyzeWebsite } from '../services/analysis.service';
import { WebsiteAnalysisRequest, WebsiteAnalysisResponse } from '../types';

export const analyzeWebsiteEndpoint = async (
  req: Request<{}, {}, WebsiteAnalysisRequest>,
  res: Response
): Promise<void> => {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    const analysis = await analyzeWebsite(url);

    const response: WebsiteAnalysisResponse = {
      analysis,
      timestamp: new Date().toISOString(),
      url,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in analysis controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};