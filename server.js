import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import routes
import userRoutes from './api/routes/user.routes.js';
import bookRoutes from './api/routes/books.routes.js';
import './api/config/db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to Library Management API!');
  console.log('Client IP:', req.ip);
});
app.use(cookieParser());

app.use('/user', userRoutes);
app.use('/book', bookRoutes);

// sequelizeDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// export default app;
