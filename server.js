import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import userRoutes from "./routes/user.routes.js";
import bookRoutes from "./routes/books.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to Library Management API!");
  console.log("Client IP:", req.ip);
});

app.use("/user", userRoutes);
app.use("/book", bookRoutes);

export default app;
