import UsuarioController from "../controllers/usuario.controller.js";
import requireAdmin from "../middlewares/requireAdmin.js";
import express from "express";

const router = express.Router();

// Todo el módulo de usuarios queda protegido hasta que el login esté terminado
router.use(requireAdmin);

router.post("/", UsuarioController.nuevoUsuario);
router.get("/", UsuarioController.obtenerUsuarios);
router.get("/:id", UsuarioController.obtenerUsuarioPorId);
router.put("/:id", UsuarioController.actualizarUsuario);
router.delete("/:id", UsuarioController.eliminarUsuario);
export default router;
