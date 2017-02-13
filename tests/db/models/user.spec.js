const expect = require('chai').expect;
const mongoose = require('mongoose');
const config = require('../../../config')('test');

describe('User model', function () {
    let connection, User, user = {}, doc;

    before(function (done) {
        connection = require('../../../config/database')(config.mongoose_connection_string);
        User = require('../../../db/models/User');
        User.remove({}).exec(done);
    });

    after(function () {
        return connection.then(() => {
            return mongoose.connection.close();
        });
    });

    beforeEach(function () {
        doc = new User(user);
    });

    context('document', function () {
        it('vk id should be required', function (done) {
            doc.validate(function (err) {
                expect(err.errors['auth.vk.id']).to.exist;
                expect(err.errors['auth.vk.id'].message).to.equal('Path `auth.vk.id` is required.');
                done();
            });
        });
    });

    context('collection', function () {
        let testUser;

        before(function () {
            user = {
                auth: { vk: { id: 'new id' } }
            };
        });

        after(function () {
            user = {};
        });

        beforeEach(function (done) {
            doc.save().then((user) => {
                testUser = user;
                done();
            });
        });

        afterEach(function (done) {
            User.remove({}).exec(done);
        });

        it('should contain unique by vk id users', function (done) {
            const duplicate = new User(user);
            duplicate.save(function (err) {
                expect(err.message.indexOf('duplicate key error')).to.be.at.least(0);
                done();
            });
        });

        it('should use timestamps', function () {
            expect(testUser).to.have.property('createdAt');
            expect(testUser).to.have.property('updatedAt');
        });
    });
});
