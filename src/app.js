import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import portfolioRouter from "./router/portfolio.router.js";
import usuarioRouter from "./router/usuario.router.js";
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL)
    .then(()=> {
        console.log("Conexión a la base de datos establecida");
    }).catch((error) => {
        console.error("Error al conectar a la base de datos:", error);
    });

//Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors({
  origin: 'http://localhost:5173',
}))


app.get("/", (req,res) => {
    res.send("Bienvenido a codeLabs")
})
app.use("/api/portfolios", portfolioRouter);
app.use("/api/usuarios", usuarioRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})