const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const config = require('./index')();
const User = require('../db/models/User');

// setup JWT passport strategy
const opts = {
    secretOrKey: config.jwt_secret,
    jwtFromRequest: function(req) {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['Authorization'];
        }
        return token;
    }
};

function verify (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.sub }, function (err, user) {
        if (err) { return done(err); }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
}

passport.use(new JwtStrategy(opts, verify));

module.exports = { opts, verify };
