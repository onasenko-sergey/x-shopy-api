const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const OrderSchema = new mongoose.Schema({
    customer: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    }
}, {
    timestamps: true
});

OrderSchema.index({ customer: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Order', OrderSchema);
