import { Request, Response } from 'express';
import { analyzeWebsite } from '../services/analysis.service';
// import { analyzeWebsiteGenerator } from '../services/analysis.service';
import { WebsiteAnalysisRequest, WebsiteAnalysisResponse } from '../types';
import { analysisQueue } from '../lib/queue';
import { prisma } from "../config/prisma";


// export const analyzeWebsiteEndpoint = async (
//   req: Request<{}, {}, WebsiteAnalysisRequest>,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { url } = req.body;

//     if (!url) {
//       res.status(400).json({ error: 'URL is required' });
//       return;
//     }

//     const analysis = await analyzeWebsiteGenerator(url);

//     const response: WebsiteAnalysisResponse = {
//       analysis,
//       timestamp: new Date().toISOString(),
//       url,
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error('Error in analysis controller:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


export const rerunAnalysisController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the projectId from query string (or you could get it from the body)
    const projectId = req.query.projectId as string;
    const userId = req.user?.userId;

    if (!projectId || !userId) {
      res.status(400).json({ error: "Missing projectId or userId" });
      return;
    }

    // Optionally, you can verify that the project exists and belongs to the user:
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.userId !== userId) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    // Update the project's status to pending (to indicate re-run is scheduled)
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "pending" },
    });

    // Enqueue a new analysis job for this project.
    await analysisQueue.add(
      { projectId, website: project.website },
      { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
    );

    res.status(200).json({ message: "Re-run analysis initiated" });
  } catch (error) {
    console.error("Error in rerunAnalysisController:", error);
    res.status(500).json({ error: "Failed to initiate re-run analysis" });
  }
};