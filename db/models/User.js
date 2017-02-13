const mongoose = require('mongoose');

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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
