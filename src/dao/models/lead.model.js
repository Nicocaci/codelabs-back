import mongoose from "mongoose";

// Los leads los crea y mantiene codelabs-agents (src/models/Lead.ts).
// Acá solo se leen y se actualizan "estado" y "reunion", por eso el esquema es abierto
// (strict: false): no hace falta duplicar el modelo completo.
const leadSchema = new mongoose.Schema({}, { strict: false, collection: "leads" });

// Si LEADS_MONGO_URL está definida (la base de codelabs-agents está en otro lado),
// se usa una conexión aparte. Si no, la misma conexión del back.
let LeadModel;
export function getLeadModel() {
  if (LeadModel) return LeadModel;
  const url = process.env.LEADS_MONGO_URL?.trim();
  const conexion = url ? mongoose.createConnection(url) : mongoose.connection;
  LeadModel = conexion.model("Lead", leadSchema);
  return LeadModel;
}
