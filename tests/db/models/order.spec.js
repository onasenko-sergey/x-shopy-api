const expect = require('chai').expect;
const mongoose = require('mongoose');
const config = require('../../../config')('test');

describe('Order model', function () {
    let connection, Order, order = {}, doc;

    before(function (done) {
        connection = require('../../../config/database')(config.mongoose_connection_string);
        Order = require('../../../db/models/Order');
        Order.remove({}).exec(done);
    });

    after(function () {
        return connection.then(() => {
            return mongoose.connection.close();
        });
    });

    beforeEach(function () {
        doc = new Order(order);
    });

    context('document', function () {
        it('user should be required', function (done) {
            doc.validate(function (err) {
                expect(err.errors.user).to.exist;
                expect(err.errors.user.message).to.equal('Path `user` is required.');
                done();
            });
        });

        it('total should be required', function (done) {
            doc.validate(function (err) {
                expect(err.errors.total).to.exist;
                expect(err.errors.total.message).to.equal('Path `total` is required.');
                done();
            });
        });

        it('total should be greater then or equal to 0', function (done) {
            doc.total = -1;
            doc.validate(function (err) {
                expect(err.errors.total).to.exist;
                expect(err.errors.total.message).to.equal('Path `total` (-1) is less than minimum allowed value (0).');
                done();
            });
        });
    });

    context('collection', function () {
        let testOrder;

        before(function () {
            order = {
                user: mongoose.Types.ObjectId(),
                total: 1
            };
        });

        after(function () {
            testOrder = {};
        });

        beforeEach(function (done) {
            doc.save().then((order) => {
                testOrder = order;
                done();
            });
        });

        afterEach(function (done) {
            Order.remove({}).exec(done);
        });

        it('should use timestamps', function () {
            expect(testOrder).to.have.property('createdAt');
            expect(testOrder).to.have.property('updatedAt');
        });
    });
});
