import PortfolioService from "../services/portfolio.services.js";

class PortfolioController {
  async createPortfolio(req, res) {
    try {
      const portfolio = await PortfolioService.createPortfolio(req.body);
      res.status(201).json(portfolio);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllPortfolios(req, res) {
    try {
      const portfolios = await PortfolioService.getAllPortfolios(req.query);
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPortfolioById(req, res) {
    try {
      const portfolio = await PortfolioService.getPortfolioById(req.params.id);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updatePortfolio(req, res) {
    try {
      const portfolio = await PortfolioService.updatePortfolio(req.params.id, req.body);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletePortfolio(req, res) {
    try {
      const portfolio = await PortfolioService.deletePortfolio(req.params.id);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      res.json({ message: "Portfolio deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new PortfolioController();