import express from 'express';
import cors from 'cors';
import studentsRouter from './routes/students';
import tasksRouter from './routes/tasks';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/students', studentsRouter);
app.use('/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
