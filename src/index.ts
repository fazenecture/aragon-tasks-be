import * as dotenv from "dotenv";
dotenv.config();

import morgan from "morgan";
import express, { Application } from "express";
import cors from "cors";
import logger from "./utils/logger";
import { Request, Response } from "express";
import apiRoutes from "./routes/index.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true);
app.use(morgan("dev"));

const PORT =  4000;

app.use("/api", apiRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "NOT_FOUND" });
});

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`🚀 Server started on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`❌ Error starting server: ${error}`);
  }
};

startServer();
