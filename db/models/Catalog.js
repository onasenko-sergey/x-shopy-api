const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const CatalogSchema = new mongoose.Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Catalog',
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
});

CatalogSchema.index({ product: 1, size: 1 }, { unique: true });

module.exports = mongoose.model('Catalog', CatalogSchema);
