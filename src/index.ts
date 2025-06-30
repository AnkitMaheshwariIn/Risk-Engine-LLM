import express from 'express';
import cors from 'cors';
import evaluateRiskRouter from './routes/evaluateRisk';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/evaluate-risk', evaluateRiskRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
}); 