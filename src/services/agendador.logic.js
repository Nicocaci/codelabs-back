// Lógica pura del Agendador (antes en n8n: nodos "Preparar" y "Decidir").
// Sin dependencias de Express ni Mongo, para poder testearla sola.

const valor = (x) => (x && typeof x === "object" && "value" in x ? x.value : x);

// Mismo criterio que codelabs-agents (src/agents/redactor/whatsapp.ts)
export function normalizarWhatsapp(telefono) {
  let d = String(telefono ?? "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("54")) d = d.slice(2);
  if (d.startsWith("9") && d.length === 11) d = d.slice(1);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.startsWith("1115") && d.length === 12) d = "11" + d.slice(4);
  else if (d.length === 12) {
    const m = d.match(/^(\d{2,4})15(\d{6,8})$/);
    if (m && m[1].length + m[2].length === 10) d = m[1] + m[2];
  }
  return d.length === 10 ? "549" + d : "";
}

const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Nodo "Preparar": lee el aviso de Cal.com y arma la búsqueda del lead
export function preparar(body = {}) {
  const evento = String(body.triggerEvent ?? "");
  const p = body.payload ?? {};
  const asistente = (p.attendees ?? [])[0] ?? {};
  const r = p.responses ?? {};

  const email = String(valor(r.email) ?? asistente.email ?? "").trim().toLowerCase();
  const telefonoCrudo = String(
    valor(r.attendeePhoneNumber) ?? valor(r.telefono) ?? asistente.phoneNumber ?? "",
  );
  const whatsapp = normalizarWhatsapp(telefonoCrudo);

  const or = [];
  if (email) or.push({ emailPublico: { $regex: "^" + escapar(email) + "$", $options: "i" } });
  if (whatsapp) or.push({ "mensaje.whatsapp": whatsapp }, { whatsapp });
  // Sin email ni teléfono no hay cómo buscar
  const query = or.length ? { $or: or } : null;

  return {
    evento,
    email,
    whatsapp,
    telefonoCrudo,
    nombre: String(valor(r.name) ?? asistente.name ?? ""),
    inicio: p.startTime ?? null,
    titulo: String(p.title ?? ""),
    notas: String(valor(r.notes) ?? p.description ?? ""),
    link: String(p.metadata?.videoCallUrl ?? p.location ?? ""),
    uid: String(p.uid ?? ""),
    query,
  };
}

const fecha = (iso) =>
  iso
    ? new Date(iso).toLocaleString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "sin fecha";

// Nodo "Decidir": junta la reserva con el lead y arma el aviso + el cambio de estado
export function decidir(b, lead) {
  if (b.evento === "PING") {
    return { texto: "✅ Agendador conectado: Cal.com ya le avisa al back.", actualizar: null };
  }

  let titulo;
  let nuevoEstado = null;
  switch (b.evento) {
    case "BOOKING_CREATED":
      titulo = "📅 Nueva reunión";
      if (lead && lead.estado !== "baja") nuevoEstado = "reunion";
      break;
    case "BOOKING_RESCHEDULED":
      titulo = "🔁 Reunión reprogramada";
      if (lead && lead.estado !== "baja") nuevoEstado = "reunion";
      break;
    case "BOOKING_CANCELLED":
      titulo = "❌ Reunión cancelada";
      if (lead && lead.estado === "reunion") nuevoEstado = "respondio";
      break;
    default:
      titulo = "ℹ️ Aviso de Cal.com: " + b.evento;
  }

  const lineas = [titulo, "", `🕒 ${fecha(b.inicio)}`, `👤 ${b.nombre || "sin nombre"}`];
  if (b.email) lineas.push(`✉️ ${b.email}`);
  if (b.telefonoCrudo) lineas.push(`📱 ${b.telefonoCrudo}`);
  if (b.link) lineas.push(`🔗 ${b.link}`);
  if (b.notas) lineas.push(`📝 ${b.notas}`);
  lineas.push("");

  if (lead) {
    lineas.push(`🏪 ${lead.nombre ?? "comercio"} (${lead.rubro ?? ""} · ${lead.zona ?? ""})`);
    if (lead.puntaje != null) lineas.push(`Puntaje: ${lead.puntaje}`);
    if (lead.gancho) lineas.push(`Gancho: ${lead.gancho}`);
    if (lead.plataforma) lineas.push(`Web: ${lead.web ?? "sin web"} (${lead.plataforma})`);
    if (lead.notas) lineas.push(`Notas: ${lead.notas}`);
    if (lead.estado === "baja") lineas.push("⚠️ Este comercio había pedido la baja: no se cambió su estado.");
    if (nuevoEstado) lineas.push(`Estado: ${lead.estado} → ${nuevoEstado}`);
  } else {
    lineas.push("No encontré el comercio en la base (busqué por email y teléfono).");
    lineas.push('Si es un lead, marcalo a mano: npm run marcar -- "<nombre>" reunion');
  }

  return {
    texto: lineas.join("\n"),
    // Solo se actualiza Mongo si hay que cambiar el estado
    actualizar: nuevoEstado
      ? {
          fuenteId: lead.fuenteId,
          estado: nuevoEstado,
          reunion: {
            inicio: b.inicio,
            uid: b.uid,
            link: b.link,
            evento: b.evento,
            recibidoEn: new Date().toISOString(),
          },
        }
      : null,
  };
}
