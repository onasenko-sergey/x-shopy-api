const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
    auth: {
        vk: {
            id: {
                type: String,
                required: true,
                unique: true
            },
            access_token: String
        }
    },
    cart: {
        items: [{
            type: Types.ObjectId,
            ref: 'Order'
        }],
        total: {
            type: Number,
            default: 0,
            min: 0
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
