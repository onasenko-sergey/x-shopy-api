const expect = require('chai').expect;
const mongoose = require('mongoose');
const config = require('../../../config')('test');

describe('CartItem model', function () {
    let connection, CartItem, cartItem = {}, doc;

    before(function (done) {
        connection = require('../../../config/database')(config.mongoose_connection_string);
        CartItem = require('../../../db/models/CartItem');
        CartItem.remove({}).exec(done);
    });

    after(function () {
        return connection.then(() => {
            return mongoose.connection.close();
        });
    });

    beforeEach(function () {
        doc = new CartItem(cartItem);
    });

    context('document', function () {
        it('user should be required', function (done) {
            doc.validate(function (err) {
                expect(err.errors.user).to.exist;
                expect(err.errors.user.message).to.equal('Path `user` is required.');
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
        let testCartItem;

        before(function () {
            cartItem = {
                user: mongoose.Types.ObjectId(),
                product: mongoose.Types.ObjectId()
            };
        });

        after(function () {
            cartItem = {};
        });

        beforeEach(function (done) {
            doc.save().then((cartItem) => {
                testCartItem = cartItem;
                done();
            });
        });

        afterEach(function (done) {
            CartItem.remove({}).exec(done);
        });

        it('should contain unique by user&product cart items', function (done) {
            const duplicate = new CartItem(cartItem);
            duplicate.save(function (err) {
                expect(err.message.indexOf('duplicate key error')).to.be.at.least(0);
                done();
            });
        });

        it('should use timestamps', function () {
            expect(testCartItem).to.have.property('createdAt');
            expect(testCartItem).to.have.property('updatedAt');
        });
    });
});
