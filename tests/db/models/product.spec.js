const expect = require('chai').expect;
const mongoose = require('mongoose');
const config = require('../../../config')('test');

describe('Product model', function () {
    let connection, Product, product = {}, doc;

    before(function (done) {
        connection = require('../../../config/database')(config.mongoose_connection_string);
        Product = require('../../../db/models/Product');
        Product.remove({}).exec(done);
    });

    after(function () {
        return connection.then(() => {
            return mongoose.connection.close();
        });
    });

    beforeEach(function () {
        doc = new Product(product);
    });

    context('document', function () {

        // brand and name are used in url slugs
        it('brand should be required', function (done) {
            doc.validate(function (err) {
                expect(err.errors.brand).to.exist;
                expect(err.errors.brand.message).to.equal('Path `brand` is required.');
                done();
            });
        });

        it('name should be required', function (done) {
            doc.validate(function (err) {
                expect(err.errors.name).to.exist;
                expect(err.errors.name.message).to.equal('Path `name` is required.');
                done();
            });
        });
    });

    context('collection', function () {
        let testProduct;

        before(function () {
            product = {
                brand: 'default',
                name: 'default',
                description: 'default',
                comprise: 'default',
                images: [''],
                colors: [''],
                categories: [0]
            };
        });

        after(function () {
            product = {};
        });

        beforeEach(function (done) {
            doc.save().then((product) => {
                testProduct = product;
                done();
            });
        });

        afterEach(function (done) {
            Product.remove({}).exec(done);
        });

        it('should contain unique by brand&name products', function (done) {
            const duplicate = new Product(product);
            duplicate.save(function (err) {
                expect(err.message.indexOf('duplicate key error')).to.be.at.least(0);
                done();
            });
        });

        it('should use timestamps', function () {
            expect(testProduct).to.have.property('createdAt');
            expect(testProduct).to.have.property('updatedAt');
        });
    });

    context('plugin', function () {
        let testProduct;

        before(function () {
            product = {
                brand: 'default',
                name: 'default',
                description: 'default',
                comprise: 'default',
                images: [''],
                colors: [''],
                categories: [0]
            };
        });

        after(function () {
            product = {};
        });

        beforeEach(function (done) {
            doc.save().then(function(product) {
                testProduct = product;
                done();
            });
        });

        afterEach(function (done) {
            Product.remove({}).exec(done);
        });

        it('`mongoose-url-slugs` should set "urlSlug" field', function () {
            expect(testProduct).to.have.property('urlSlug');
        });

        it('`mongoose-simple-random` should provide random methods', function () {
            expect(Product).itself.to.respondTo('findRandom');
        });
    });
});
