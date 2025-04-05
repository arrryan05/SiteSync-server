import express from 'express';
import analysisRoutes from './routes/analysis.route';
import { CorsOptions } from 'cors';

const app = express();
app.use(express.json());




// Routes
app.use('/api/analysis', analysisRoutes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
