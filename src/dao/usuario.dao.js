import UsuarioModel from "./models/usuario.model.js";

class UsuarioDAO {
    async nuevoUsuario(usuarioData){
        return await UsuarioModel.create(usuarioData);
    }
    async obtenerUsuarios(){
        return await UsuarioModel.find();
    }
    async obtenerUsuarioPorId(id){
        return await UsuarioModel.findById(id);
    }
    async actualizarUsuario(id, usuarioData){
        return await UsuarioModel.findByIdAndUpdate(id, usuarioData, { new: true });
    }
    async eliminarUsuario(id){
        return await UsuarioModel.findByIdAndDelete(id);
    }
}

export default new UsuarioDAO();