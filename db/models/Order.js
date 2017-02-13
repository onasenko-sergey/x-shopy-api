const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const OrderSchema = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    bundle: [{
        product: {
            type: Types.ObjectId,
            ref: 'ProductType',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
