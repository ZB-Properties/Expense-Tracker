const express = require('express');
const router = express.Router();
const { 
    addBudget, 
    getBudgets, 
    updateBudget, 
    deleteBudget } = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');



router.use(authMiddleware);

router.post('/', addBudget);
router.get('/', getBudgets);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
