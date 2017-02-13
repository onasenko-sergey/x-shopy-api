const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const CartItemSchema = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Types.ObjectId,
        ref: 'ProductType',
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

CartItemSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', CartItemSchema);
