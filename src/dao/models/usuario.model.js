import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    rol: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
})
const UsuarioModel = mongoose.model("Usuario", usuarioSchema);

export default UsuarioModel;