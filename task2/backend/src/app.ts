import express from 'express';
import cors from 'cors';
import { requestId } from './middleware/requestId';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import studentsRouter from './routes/students';
import tasksRouter from './routes/tasks';

const app = express();

app.use(requestId);
app.use(logger);
app.use(cors());
app.use(express.json());

app.use('/students', studentsRouter);
app.use('/tasks', tasksRouter);

app.use(errorHandler);

export default app;
