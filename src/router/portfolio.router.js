import PortfolioController from '../controllers/portfolio.controller.js';
import requireAdmin from '../middlewares/requireAdmin.js';
import express from 'express';

const router = express.Router();

// Lectura: pública (la usa la landing)
router.get('/', PortfolioController.getAllPortfolios);
router.get('/:id', PortfolioController.getPortfolioById);

// Escritura: solo con x-admin-key
router.post('/create', requireAdmin, PortfolioController.createPortfolio);
router.put('/:id', requireAdmin, PortfolioController.updatePortfolio);
router.delete('/:id', requireAdmin, PortfolioController.deletePortfolio);

export default router;
