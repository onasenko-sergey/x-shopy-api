const mlab = {
    username: 'shopy',
    password: process.env.MLAB_PASS,
    host: 'ds139949.mlab.com',
    port: '39949',
    database: 'shopy'
};

module.exports = {
    mongoose_connection_string: `mongodb://${mlab.username}:${mlab.password}@${mlab.host}:${mlab.port}/${mlab.database}`
};
