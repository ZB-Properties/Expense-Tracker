const express = require('express');
const router = express.Router();
const { getSummaryAnalytics, getMonthlyAnalytics } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');



router.use(authMiddleware);


router.get('/', getSummaryAnalytics);
router.get('/monthly', getMonthlyAnalytics);


module.exports = router;
