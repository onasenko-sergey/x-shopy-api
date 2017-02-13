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
        it('customer should be required', function (done) {
            doc.validate(function (err) {
                expect(err.errors.customer).to.exist;
                expect(err.errors.customer.message).to.equal('Path `customer` is required.');
                done();
            });
        });

        it('product should be required', function (done) {
            doc.validate(function (err) {
                expect(err.errors.product).to.exist;
                expect(err.errors.product.message).to.equal('Path `product` is required.');
                done();
            });
        });

        it('quantity should be required', function (done) {
            doc.quantity = null;
            doc.validate(function (err) {
                expect(err.errors.quantity).to.exist;
                expect(err.errors.quantity.message).to.equal('Path `quantity` is required.');
                done();
            });
        });

        it('quantity should be 1 by default', function () {
            expect(doc.quantity).to.eql(1);
        });

        it('quantity should be greater then or equal to 1', function (done) {
            doc.quantity = -1;
            doc.validate(function (err) {
                expect(err.errors.quantity).to.exist;
                expect(err.errors.quantity.message).to.equal('Path `quantity` (-1) is less than minimum allowed value (1).');
                done();
            });
        });
    });

    context('collection', function () {
        before(function () {
            order = {
                customer: mongoose.Types.ObjectId(),
                product: mongoose.Types.ObjectId()
            };
        });

        after(function () {
            order = {};
        });

        beforeEach(function (done) {
            doc.save(done);
        });

        afterEach(function (done) {
            Order.remove({}).exec(done);
        });

        it('should contain unique by customer&product orders', function (done) {
            const duplicate = new Order(order);
            duplicate.save(function (err) {
                expect(err.message.indexOf('duplicate key error')).to.be.at.least(0);
                done();
            });
        });
    });

    context('timestamps', function () {
        let testOrder;

        before(function () {
            order = {
                customer: mongoose.Types.ObjectId(),
                product: mongoose.Types.ObjectId()
            };
        });

        after(function () {
            order = {};
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

        it('should be enabled', function () {
            expect(testOrder).to.have.property('createdAt');
            expect(testOrder).to.have.property('updatedAt');
        });
    });
});
