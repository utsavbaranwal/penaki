const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        contact: { type: String, required: true },
    },
    shippingAddress: {
        houseNo: { type: String, required: true },
        locality: { type: String, required: true },
        pincode: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
    },
    items: [
        {
            id: Number, // Changed from String to Number
            name: String,
            quantity: Number,
            unitPrice: Number,
            color: String,
            image: String,
            basePrice: Number,
            equipmentPrice: Number,
            bespokePrice: Number
        }
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    orderDate: {
        type: Date,
        default: Date.now
    },
    paymentDetails: {
        razorpay_order_id: { type: String, required: true },
        razorpay_payment_id: { type: String, required: true },
        razorpay_signature: { type: String, required: true },
        status: { type: String, default: 'Paid' }
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;