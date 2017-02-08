const mongodb = {
    host: 'localhost',
    port: 27017,
    database: 'shopy'
};

module.exports = {
    mongoose_connection_string: `mongodb://${mongodb.host}:${mongodb.port}/${mongodb.database}`
};
