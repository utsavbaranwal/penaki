const Order = require('../models/orderModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
    try {
        const options = {
            amount: Number(req.body.amount * 100), // amount in the smallest currency unit
            currency: "INR",
        };
        const order = await instance.orders.create(options);

        if (!order) {
            return res.status(500).send("Error creating Razorpay order.");
        }

        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Server error while creating order.' });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            orderData
        } = req.body;

        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpaySignature) {
            return res.status(400).json({ message: 'Transaction not legit!' });
        }

        // Transaction is legit, now save the order to DB
        const { customer, shippingAddress, items, subtotal, deliveryFee, total } = orderData;

        if (!customer || !shippingAddress || !items || items.length === 0) {
            return res.status(400).json({ message: 'Missing required order information.' });
        }

        const newOrder = new Order({
            customer,
            shippingAddress,
            items,
            subtotal,
            deliveryFee,
            total,
            paymentDetails: {
                razorpay_order_id: razorpayOrderId,
                razorpay_payment_id: razorpayPaymentId,
                razorpay_signature: razorpaySignature,
                status: 'Paid'
            }
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({
            message: 'Order placed successfully!',
            orderId: savedOrder._id,
            paymentId: razorpayPaymentId
        });

    } catch (error) {
        console.error('Error verifying payment and placing order:', error);
        res.status(500).json({ message: 'Server error while placing order.' });
    }
};

module.exports = { createOrder, verifyPayment };