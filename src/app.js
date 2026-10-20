import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import portfolioRouter from "./router/portfolio.router.js";
import usuarioRouter from "./router/usuario.router.js";
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Orígenes permitidos, separados por coma. Ej: "https://codelabs.com.ar,https://www.codelabs.com.ar"
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

mongoose.connect(process.env.MONGO_URL)
    .then(()=> {
        console.log("Conexión a la base de datos establecida");
    }).catch((error) => {
        console.error("Error al conectar a la base de datos:", error);
        // Sin base de datos la API no sirve: salir para que Railway reinicie el servicio
        process.exit(1);
    });

//Middleware
app.use(cors({ origin: allowedOrigins }))
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100kb' }));
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.send("Bienvenido a codeLabs")
})
// Para el healthcheck de Railway
app.get("/health", (req, res) => {
    const dbOk = mongoose.connection.readyState === 1;
    res.status(dbOk ? 200 : 503).json({ status: dbOk ? "ok" : "db_disconnected" });
})
app.use("/api/portfolios", portfolioRouter);
app.use("/api/usuarios", usuarioRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})
