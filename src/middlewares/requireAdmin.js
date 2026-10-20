import { timingSafeEqual } from "node:crypto";

// Protege las rutas de escritura: exige el header "x-admin-key" igual a ADMIN_API_KEY.
// Sin esa variable configurada, la ruta queda bloqueada (falla cerrada, no abierta).
const requireAdmin = (req, res, next) => {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    return res.status(503).json({ error: "ADMIN_API_KEY no está configurada" });
  }

  const received = req.get("x-admin-key") ?? "";
  const a = Buffer.from(received);
  const b = Buffer.from(expected);

  // timingSafeEqual evita filtrar la clave por diferencias de tiempo
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return res.status(401).json({ error: "No autorizado" });
  }
  next();
};

export default requireAdmin;
