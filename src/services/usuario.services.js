import UsuarioRepository from "../repositories/usuario.repository.js";

class UsuarioService {
    async nuevoUsuario(usuarioData) {
        return await UsuarioRepository.nuevoUsuario(usuarioData);
    }
    async obtenerUsuarios() {
        return await UsuarioRepository.obtenerUsuarios();
    }
    async obtenerUsuarioPorId(id) {
        return await UsuarioRepository.obtenerUsuarioPorId(id);
    }
    async actualizarUsuario(id, usuarioData) {
        return await UsuarioRepository.actualizarUsuario(id, usuarioData);
    }
    async eliminarUsuario(id) {
        return await UsuarioRepository.eliminarUsuario(id);
    }
}
export default new UsuarioService();