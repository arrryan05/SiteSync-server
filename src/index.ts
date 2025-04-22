import express from 'express';
import analysisRoutes from './routes/analysis.route';
import projectRouter from "./routes/project.route";
import authRoutes from "./routes/auth.route";
import streamRoutes from "./routes/stream.route";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerOptions } from "./swaggerOptions";

import cors from 'cors';
import seedRoutes from "./routes/seed.route";

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",  
  credentials: true,                
}));


// Routes
app.use('/api/analysis', analysisRoutes);
app.use("/api/project", projectRouter);
app.use("/api/auth", authRoutes);
app.use("/api", streamRoutes);



const specs = swaggerJsdoc(swaggerOptions); 

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


app.use("/api", seedRoutes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
