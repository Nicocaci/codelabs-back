import PortfolioRepository from "../repositories/portfolio.repository.js";

class PortfolioService {
  async createPortfolio(portfolioData) {
    return await PortfolioRepository.createPortfolio(portfolioData);
  }
  async getAllPortfolios(filters = {}) {
    return await PortfolioRepository.getAllPortfolios(filters);
  }
  async getPortfolioById(id) {
    return await PortfolioRepository.getPortfolioById(id);
  }
  async updatePortfolio(id, portfolioData) {
    return await PortfolioRepository.updatePortfolio(id, portfolioData);
  }
  async deletePortfolio(id) {
    return await PortfolioRepository.deletePortfolio(id);
  }
}

export default new PortfolioService();
