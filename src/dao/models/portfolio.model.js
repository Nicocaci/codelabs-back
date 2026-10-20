import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
    imagen: {
        type: [String]
    },
    servicio: {
        type: String,
        required: true,
    },
    desafio: {
        type: String,
        required: true,
    },
    solucion: {
        type: String,
        required: true,
    },
    caracteristicas: {
        type: [String]
    },
    url: {
        type: String,
        required: true,
    },
destacado: {
    type: Boolean,
    default: false,
},
resultado: {
    type: String,
},
})

const PortfolioModel = mongoose.model('Portfolio', portfolioSchema);

export default PortfolioModel;