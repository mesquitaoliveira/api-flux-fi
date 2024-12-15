import express from "express";
import cors from "cors";
import { qrCodeRouter } from "./routes/qrCodeRoute";

const app = express();

const corsOptions = {
  origin: "*", // Permitir todas as origens
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Rotas
app.use("/api", qrCodeRouter);

export default app;
