const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/orderController');
const router = express.Router();

router.post('/create', createOrder);
router.post('/verify', verifyPayment);

module.exports = router;