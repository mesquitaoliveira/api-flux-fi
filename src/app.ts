import express from "express";
import cors from "cors";
import { qrCodeRouter } from "./routes/qrCodeRoute";

const app = express();

const corsOptions = {
  origin: "https://flux-fi.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Rotas
app.use("/api", qrCodeRouter);

export default app;
