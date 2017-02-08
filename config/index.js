// use let instead of const for testing purposes(rewire can't change const variables)
let development = require('./env/development');
let production = require('./env/production');
let test = require('./env/test');

module.exports = function (env = process.env.NODE_ENV) {
    switch (env) {
        case 'production':
            return Object.assign({}, development, production);
        case 'test':
            return Object.assign({}, development, test);
        default:
            return development;
    }
};
