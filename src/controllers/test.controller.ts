import { Request, Response } from "express";
import { analyzeWebsite } from "../services/analysis.service";

export const pinpointAnalysisController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { gitRepoUrl, websiteUrl,name } = req.body;
    if (!websiteUrl) {
      res.status(400).json({ error: "Missing websiteUrl in request body" });
      return;
    }

    // Call analyzeWebsite() with both parameters:
    //   url      = websiteUrl
    //   gitRepoUrl = gitRepoUrl (may be undefined)
    console.log("Starting pinpoint analysis:", { gitRepoUrl, websiteUrl });
    const resultJson = await analyzeWebsite(websiteUrl,name, gitRepoUrl);

    // Return the JSON string as an object
    res.status(200).json(JSON.parse(resultJson));
  } catch (err: any) {
    console.error("pinpointAnalysisController error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
