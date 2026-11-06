import { preparar, decidir } from "./agendador.logic.js";
import { getLeadModel } from "../dao/models/lead.model.js";
import { avisarTelegram } from "../utils/telegram.js";

class AgendadorService {
  // Procesa un aviso de Cal.com: busca el lead, avisa por Telegram y actualiza el estado
  async procesar(body) {
    const b = preparar(body);
    const Lead = getLeadModel();

    const lead =
      b.evento !== "PING" && b.query ? await Lead.findOne(b.query).lean() : null;

    const { texto, actualizar } = decidir(b, lead);

    // Primero Mongo (lo importante), después el aviso
    if (actualizar) {
      await Lead.updateOne(
        { fuenteId: actualizar.fuenteId },
        { $set: { estado: actualizar.estado, reunion: actualizar.reunion, updatedAt: new Date() } },
      );
    }
    await avisarTelegram(texto);

    return { evento: b.evento, lead: lead?.fuenteId ?? null, estado: actualizar?.estado ?? null };
  }
}

export default new AgendadorService();
