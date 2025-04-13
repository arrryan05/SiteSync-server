import express from 'express';
import analysisRoutes from './routes/analysis.route';
import projectRouter from "./routes/project.route";

import { CorsOptions } from 'cors';
import seedRoutes from "./routes/seed.route";

const app = express();
app.use(express.json());


// Routes
app.use('/api/analysis', analysisRoutes);
app.use("/api/project", projectRouter);

app.use("/api", seedRoutes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
