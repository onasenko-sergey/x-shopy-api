const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function (connection_string) {
    // connection settings
    const options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
    return mongoose.connect(connection_string, options)
        .catch(function (err) {
            console.error('Mongoose connection error: ', err.message);
            throw err;
        });
};
