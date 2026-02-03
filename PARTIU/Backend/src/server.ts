import express, { Application } from "express";
import { AppDataSource } from "./config/Data-source";
import authRoutes from "./routes/AuthRoutes";
import userRoutes from "./routes/UserRoutes";
import tripRoutes from "./routes/TripRoutes";
import itemRoutes from "./routes/ItemRoutes";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", tripRoutes);
app.use("/api", itemRoutes);

const PORT = Number(process.env.PORT || "3000");

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });