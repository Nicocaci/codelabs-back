import PortfolioModel from "./models/portfolio.model.js";

class PortfolioDao {
  async createPortfolio(portfolioData) {
    const portfolio = new PortfolioModel(portfolioData);
    return await portfolio.save();
  }
  async getAllPortfolios(filters = {}) {
    const { nombre, servicio } = filters;
    const query = {};

    // Solo se filtra por lo que realmente llegó, y solo si es texto
    if (typeof servicio === "string" && servicio) query.servicio = servicio;
    if (typeof nombre === "string" && nombre) {
      const escaped = nombre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.nombre = { $regex: escaped, $options: "i" };
    }

    return await PortfolioModel.find(query).sort({ fechaCreacion: -1 });
  }
  async getPortfolioById(id) {
    return await PortfolioModel.findById(id);
  }
  async updatePortfolio(id, portfolioData) {
    return await PortfolioModel.findByIdAndUpdate(id, portfolioData, {
      new: true,
      runValidators: true,
    });
  }
  async deletePortfolio(id) {
    return await PortfolioModel.findByIdAndDelete(id);
  }
}

export default new PortfolioDao();
