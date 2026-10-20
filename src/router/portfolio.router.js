import PortfolioController from '../controllers/portfolio.controller.js';
import express from 'express';

const router = express.Router();

router.post('/create', PortfolioController.createPortfolio);
router.get('/', PortfolioController.getAllPortfolios);
router.get('/:id', PortfolioController.getPortfolioById);
router.put('/:id', PortfolioController.updatePortfolio);
router.delete('/:id', PortfolioController.deletePortfolio);

export default router;