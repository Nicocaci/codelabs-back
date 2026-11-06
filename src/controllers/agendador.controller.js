import { createHmac, timingSafeEqual } from "node:crypto";
import AgendadorService from "../services/agendador.services.js";

const igualSeguro = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

class AgendadorController {
  async calcom(req, res) {
    // 1) Ruta secreta: /webhooks/calcom/<CALCOM_WEBHOOK_TOKEN>
    const token = process.env.CALCOM_WEBHOOK_TOKEN;
    if (!token) return res.status(503).json({ error: "CALCOM_WEBHOOK_TOKEN no está configurada" });
    if (!igualSeguro(req.params.token ?? "", token)) return res.sendStatus(404);

    // 2) Firma de Cal.com (opcional pero recomendada): HMAC-SHA256 del cuerpo crudo
    const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from("");
    const secreto = process.env.CALCOM_WEBHOOK_SECRET;
    if (secreto) {
      const esperada = createHmac("sha256", secreto).update(raw).digest("hex");
      const recibida = req.get("x-cal-signature-256") ?? "";
      if (!igualSeguro(recibida, esperada)) return res.status(401).json({ error: "Firma inválida" });
    }

    let body;
    try {
      body = JSON.parse(raw.toString("utf8") || "{}");
    } catch {
      return res.status(400).json({ error: "JSON inválido" });
    }

    // Igual que n8n ("responder al recibir"): se contesta ya y se procesa después
    res.status(200).json({ ok: true });

    try {
      const r = await AgendadorService.procesar(body);
      console.log("[agendador]", JSON.stringify(r));
    } catch (error) {
      console.error("[agendador] error procesando aviso de Cal.com:", error);
    }
  }
}

export default new AgendadorController();
