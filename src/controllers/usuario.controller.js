import UsuarioServices from "../services/usuario.services.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/jsonwebtoken.js";

class UsuarioController {
    async nuevoUsuario(req,res) {
        try {
            const { nombre, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const usuarioData = { nombre, email, password: hashedPassword };
            const nuevoUsuario = await UsuarioServices.nuevoUsuario(usuarioData);
            res.status(201).json(nuevoUsuario);
        }
        catch (error) {
            res.status(500).json({ error: "Error al crear el usuario" });
        }
    }
    async obtenerUsuarios(req,res) {
        try {
            const usuarios = await UsuarioServices.obtenerUsuarios();
            res.status(200).json(usuarios);
        }
        catch (error) {
            res.status(500).json({ error: "Error al obtener los usuarios" });
        }
    }
    async obtenerUsuarioPorId(req,res) {
        try {
            const { id } = req.params;
            const usuario = await UsuarioServices.obtenerUsuarioPorId(id);
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.status(200).json(usuario);
        }
        catch (error) {
            res.status(500).json({ error: "Error al obtener el usuario" });
        }
    }
    async actualizarUsuario(req,res) {
        try {
            const { id } = req.params;
            const { nombre, email } = req.body;
            const usuarioActualizado = await UsuarioServices.actualizarUsuario(id, { nombre, email });
            if (!usuarioActualizado) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.status(200).json(usuarioActualizado);
        }
        catch (error) {
            res.status(500).json({ error: "Error al actualizar el usuario" });
        }
    }
    async eliminarUsuario(req,res) {
        try {
            const { id } = req.params;
            const usuarioEliminado = await UsuarioServices.eliminarUsuario(id);
            if (!usuarioEliminado) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.status(200).json({ message: "Usuario eliminado correctamente" });
        }
        catch (error) {
            res.status(500).json({ error: "Error al eliminar el usuario" });
        }
    }
    async login(req,res) {
        try {
            const { email, password } = req.body;
            const usuarios = await UsuarioServices.obtenerUsuarios();
            const usuario = usuarios.find(u => u.email === email);
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            const isMatch = await bcrypt.compare(password, usuario.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }
            const token = generateToken({ id: usuario._id, email: usuario.email });
            res.status(200).json({ token });
        }
        catch (error) {
            res.status(500).json({ error: "Error al iniciar sesión" });
        }
    }
    async logout(req,res) {
        try {
            // Invalidate the token on the client side (e.g., remove it from local storage)
            res.status(200).json({ message: "Sesión cerrada correctamente" });
        }
        catch (error) {
            res.status(500).json({ error: "Error al cerrar sesión" });
        }
    }
}
export default new UsuarioController();