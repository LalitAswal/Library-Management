import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import cors from "cors";

// Import routes
import user from "./routes/user.routes.js";
import book from "./routes/books.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to Library Management API!");
  console.log(req.ip);
});

// Middleware for routes
app.use("/user", user);
app.use("/book", book);

// Sync database
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & table created!");
  })
  .catch((err) => {
    console.error("Unable to create table, shutting down ...", err);
  });

export default app;
