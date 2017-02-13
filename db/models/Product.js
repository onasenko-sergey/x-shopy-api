const mongoose = require('mongoose');
const random = require('mongoose-simple-random');
const URLSlugs = require('mongoose-url-slugs');

const ProductSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    comprise: {
        type: String
    },
    images: {
        type: [String],
        required: true
    },
    colors: {
        type: [String],
        required: true
    },
    categories: {
        type: [Number],
        required: true
    }
}, {
    timestamps: true
});

ProductSchema.index({ brand: 1, name: 1 }, { unique: true });

ProductSchema.plugin(random);
ProductSchema.plugin(URLSlugs('brand name', { field: 'urlSlug', update: true }));

module.exports = mongoose.model('Product', ProductSchema);
