import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import express from "express";
import { preparar, decidir, normalizarWhatsapp } from "../src/services/agendador.logic.js";
import webhookRouter from "../src/router/webhook.router.js";
import AgendadorService from "../src/services/agendador.services.js";

const reserva = {
  triggerEvent: "BOOKING_CREATED",
  payload: {
    startTime: "2026-11-10T15:00:00Z", uid: "abc", title: "Reunión inicial",
    attendees: [{ name: "Juan", email: "Juan@Ferre.com" }],
    responses: { attendeePhoneNumber: { value: "011 15-2345-6789" } },
    metadata: { videoCallUrl: "https://meet/x" },
  },
};

test("normalizar whatsapp", () => {
  assert.equal(normalizarWhatsapp("011 15-2345-6789"), "5491123456789");
  assert.equal(normalizarWhatsapp("+54 9 11 2345 6789"), "5491123456789");
  assert.equal(normalizarWhatsapp(""), "");
});

test("preparar arma la query por email y whatsapp", () => {
  const b = preparar(reserva);
  assert.equal(b.email, "juan@ferre.com");
  assert.equal(b.whatsapp, "5491123456789");
  assert.equal(b.query.$or.length, 3);
  assert.equal(preparar({ triggerEvent: "PING" }).query, null);
});

test("decidir: estados", () => {
  const b = preparar(reserva);
  const lead = { fuenteId: "osm/1", estado: "respondio", nombre: "Ferre" };
  assert.equal(decidir(b, lead).actualizar.estado, "reunion");
  assert.equal(decidir(b, { ...lead, estado: "baja" }).actualizar, null);
  assert.equal(decidir(b, null).actualizar, null);
  const canc = preparar({ ...reserva, triggerEvent: "BOOKING_CANCELLED" });
  assert.equal(decidir(canc, { ...lead, estado: "reunion" }).actualizar.estado, "respondio");
  assert.equal(decidir(canc, lead).actualizar, null);
  assert.match(decidir(preparar({ triggerEvent: "PING" }), null).texto, /conectado/);
});

test("ruta: token, firma y body crudo", async () => {
  process.env.CALCOM_WEBHOOK_TOKEN = "tok123";
  process.env.CALCOM_WEBHOOK_SECRET = "sec";
  const recibidos = [];
  AgendadorService.procesar = async (body) => { recibidos.push(body); return {}; };
  const app = express();
  app.use("/webhooks", webhookRouter);
  app.use(express.json());
  const srv = app.listen(0);
  const url = `http://127.0.0.1:${srv.address().port}/webhooks/calcom/`;
  const raw = JSON.stringify(reserva);
  const firma = createHmac("sha256", "sec").update(raw).digest("hex");
  const post = (t, sig, b = raw) => fetch(url + t, { method: "POST", headers: { "content-type": "application/json", "x-cal-signature-256": sig }, body: b });
  assert.equal((await post("malo", firma)).status, 404);
  assert.equal((await post("tok123", "x")).status, 401);
  assert.equal((await post("tok123", firma)).status, 200);
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(recibidos.length, 1);
  assert.equal(recibidos[0].payload.uid, "abc");
  srv.close();
});
