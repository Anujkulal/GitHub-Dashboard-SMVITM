import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

configDotenv();

connectDB(process.env.MONGO_URI);


const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  })
);

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes)
app.use('/api/students', studentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});