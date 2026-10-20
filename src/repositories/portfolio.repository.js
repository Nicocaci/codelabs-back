import PortfolioDao from "../dao/portfolio.dao.js";

class PortfolioRepository {
    async createPortfolio(portfolioData) {
        return await PortfolioDao.createPortfolio(portfolioData);
    }
    async getAllPortfolios(filters = {}) {
        return await PortfolioDao.getAllPortfolios(filters);
    }
    async getPortfolioById(id) {
        return await PortfolioDao.getPortfolioById(id);
    }
    async updatePortfolio(id, portfolioData) {
        return await PortfolioDao.updatePortfolio(id, portfolioData);
    }
    async deletePortfolio(id) {
        return await PortfolioDao.deletePortfolio(id);
    }
}

export default new PortfolioRepository();