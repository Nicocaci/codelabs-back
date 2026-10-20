import UsuarioController from "../controllers/usuario.controller.js";
import express from "express";

const router = express.Router();

router.post("/", UsuarioController.nuevoUsuario);
router.get("/", UsuarioController.obtenerUsuarios);
router.get("/:id", UsuarioController.obtenerUsuarioPorId);
router.put("/:id", UsuarioController.actualizarUsuario);
router.delete("/:id", UsuarioController.eliminarUsuario);
export default router;