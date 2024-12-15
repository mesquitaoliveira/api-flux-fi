import express from "express";
import cors from "cors";
import { qrCodeRouter } from "./routes/qrCodeRoute";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api", qrCodeRouter);

export default app;
