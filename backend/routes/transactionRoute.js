const express = require('express');
const router = express.Router();
const { 
    addTransaction, 
    getTransactions, 
    updateTransaction, 
    deleteTransaction } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');



router.use(authMiddleware);


router.post('/', addTransaction);
router.get('/', getTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);


module.exports = router;
