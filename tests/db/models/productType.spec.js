const expect = require('chai').expect;
const mongoose = require('mongoose');
const config = require('../../../config')('test');

describe('ProductType model', function () {
    let connection, ProductType, productType = {}, doc;

    before(function (done) {
        connection = require('../../../config/database')(config.mongoose_connection_string);
        ProductType = require('../../../db/models/ProductType');
        ProductType.remove({}).exec(done);
    });

    after(function () {
        return connection.then(() => {
            return mongoose.connection.close();
        });
    });

    beforeEach(function () {
        doc = new ProductType(productType);
    });

    context('document', function () {
        it('product should be required', function (done) {
            doc.validate(function (err) {
                expect(err.errors.product).to.exist;
                expect(err.errors.product.message).to.equal('Path `product` is required.');
                done();
            });
        });

        it('size should be required', function (done) {
            doc.validate(function (err) {
                expect(err.errors.size).to.exist;
                expect(err.errors.size.message).to.equal('Path `size` is required.');
                done();
            });
        });

        it('price should be required', function (done) {
            doc.validate(function (err) {
                expect(err.errors.price).to.exist;
                expect(err.errors.price.message).to.equal('Path `price` is required.');
                done();
            });
        });

        it('available should be required', function (done) {
            doc.available = null;
            doc.validate(function (err) {
                expect(err.errors.available).to.exist;
                expect(err.errors.available.message).to.equal('Path `available` is required.');
                done();
            });
        });

        it('available should be 0 by default', function () {
            expect(doc.available).to.eql(0);
        });

        it('available should be greater then or equal to 0', function (done) {
            doc.available = -1;
            doc.validate(function (err) {
                expect(err.errors.available).to.exist;
                expect(err.errors.available.message).to.equal('Path `available` (-1) is less than minimum allowed value (0).');
                done();
            });
        });
    });

    context('collection', function () {
        let testProductType;

        before(function () {
            productType = {
                product: mongoose.Types.ObjectId(),
                size: 1,
                price: 1
            };
        });

        after(function () {
            productType = {};
        });

        beforeEach(function (done) {
            doc.save().then((productType) => {
                testProductType = productType;
                done();
            });
        });

        afterEach(function (done) {
            ProductType.remove({}).exec(done);
        });

        it('should contain unique by product&size items', function (done) {
            const duplicate = new ProductType(productType);
            duplicate.save(function (err) {
                expect(err.message.indexOf('duplicate key error')).to.be.at.least(0);
                done();
            });
        });

        it('should use timestamps', function () {
            expect(testProductType).to.have.property('createdAt');
            expect(testProductType).to.have.property('updatedAt');
        });
    });
});
