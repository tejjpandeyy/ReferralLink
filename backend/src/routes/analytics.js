const express = require('express');
const { getLinkAnalytics, getOverallAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/overview', getOverallAnalytics);
router.get('/links/:id', getLinkAnalytics);

module.exports = router;
