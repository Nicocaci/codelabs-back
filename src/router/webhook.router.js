import express from "express";
import AgendadorController from "../controllers/agendador.controller.js";

const router = express.Router();

// Cuerpo crudo: hace falta para verificar la firma de Cal.com.
// Este router se monta ANTES de express.json() en app.js.
router.post(
  "/calcom/:token",
  express.raw({ type: "*/*", limit: "100kb" }),
  AgendadorController.calcom,
);

export default router;
