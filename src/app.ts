import express from "express";
import cors from "cors";
import { qrCodeRouter } from "./routes/qrCodeRoute";

const app = express();

const corsOptions = {
  origin: ["https://flux-fi.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/api", qrCodeRouter);

export default app;
