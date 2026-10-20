import UsuarioDAO from "../dao/usuario.dao.js";

class UsuarioRepository {
  async nuevoUsuario(usuarioData) {
    return await UsuarioDAO.nuevoUsuario(usuarioData);
  }

  async obtenerUsuarios() {
    return await UsuarioDAO.obtenerUsuarios();
  }

  async obtenerUsuarioPorId(id) {
    return await UsuarioDAO.obtenerUsuarioPorId(id);
  }

  async actualizarUsuario(id, usuarioData) {
    return await UsuarioDAO.actualizarUsuario(id, usuarioData);
  }

  async eliminarUsuario(id) {
    return await UsuarioDAO.eliminarUsuario(id);
  }
}

export default new UsuarioRepository();
