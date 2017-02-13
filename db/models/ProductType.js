const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const ProductTypeSchema = new mongoose.Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    available: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

ProductTypeSchema.index({ product: 1, size: 1 }, { unique: true });

module.exports = mongoose.model('ProductType', ProductTypeSchema);
