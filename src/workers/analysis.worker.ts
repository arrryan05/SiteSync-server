import { analysisQueue } from "../lib/queue";
import { prisma } from "../config/prisma";
import { analyzeWebsite } from "../services/analysis.service";

analysisQueue.process(5, async (job) => {  // Process up to 5 jobs concurrently
  const { projectId, website } = job.data;
  console.log(`Processing analysis for project ${projectId} with website ${website}`);
  
  try {
    // Call your analysis service to get the analysis result as a string.
    const analysisResult = await analyzeWebsite(website);
    console.log(analysisResult)
    
    // Attempt to parse the returned analysis result as JSON.
    let parsedResult;
    try {
      parsedResult = JSON.parse(analysisResult);
      console.log(parsedResult);
    } catch (parseError) {
      console.error(
        `Failed to parse analysis result JSON for project ${projectId}. Storing raw result.`,
        parseError
      );
      // Fallback: store the raw string inside an object.
      parsedResult = { raw: analysisResult };
    }
    
    // Update the project record with the parsed JSON and mark it as complete.
    await prisma.project.update({
      where: { id: projectId },
      data: { analysis: parsedResult, status: "complete" },
    });
    
    console.log(`Project ${projectId} updated successfully.`);
    return Promise.resolve();
  } catch (error) {
    console.error(`Error processing project ${projectId}:`, error);
    
    // Optionally update the project status to "error" in case of processing failure.
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "error" },
    });
    
    // This will allow Bull to retry the job if configured.
    throw error;
  }
});
