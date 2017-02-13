const mongoose = require('mongoose');
const faker = require('faker');
const _ = require('lodash');
const shortid = require('shortid');

const config = require('../../config/index')('development');
const connection = require('../../config/database')(config.mongoose_connection_string);

const Product = require('../models/Product');
const Catalog = require('../models/Catalog');

function createProduct() {
    const product = new Product();
    product.brand = faker.random.arrayElement(['Reebok', 'Adidas', 'Nike', 'Active']);
    product.name = faker.commerce.productName();
    product.description = faker.lorem.sentences(2);
    product.comprise = faker.lorem.sentence();
    const imagesCount = faker.random.number({min: 1, max: 7});
    for (let j = 0; j <= imagesCount; j++) {
        const img = faker.image.fashion.apply(
            {},
            faker.random.arrayElement([[320, 240], [480,320], [640, 480], [720, 480]])
        );
        product.images.push(img + '?s=' + shortid.generate());
    }
    const colorsCount = faker.random.number({min: 1, max: 4});
    for (let j = 0; j < colorsCount; j++) {
        product.colors.push(faker.commerce.color());
    }
    const categoriesCount = faker.random.number({min: 1, max: 3});
    while (product.categories.length < categoriesCount) {
        product.categories.push(faker.random.number({max: 2}));
        product.categories = _.uniq(product.categories);
    }
    product.categories = _.sortBy(product.categories);
    return product.save();
}

function createCatalogItems(product) {
    const catalogItems = [];
    // number of sub-products
    const range = faker.random.number({min: 1, max: 4});
    let sizes = [];
    while (sizes.length < range) {
        sizes.push(faker.random.number({max: 4}));
        sizes = _.uniq(sizes);
    }
    sizes = _.sortBy(sizes);
    for (let size of sizes) {
        const catalogItem = new Catalog({
            product,
            size,
            price: faker.commerce.price(),
            available: faker.random.number({min: 3, max: 15})
        });
        catalogItems.push(catalogItem.save());
    }
    return Promise.all(catalogItems);
}

function seedProducts(quantity = 1) {
    const product_save_promises = [];
    for (let i = 0; i < quantity; i++) {
        product_save_promises.push(
            createProduct().then((product) => {
                return createCatalogItems(product);
            })
        );
    }
    return Promise.all(product_save_promises);
}

module.exports = {
    default: function () {
        return connection
            .then(() => {
                console.log('seed products');
                return seedProducts(100)
                    .then(
                        () => { console.log('success'); },
                        () => { console.log('failure'); }
                    );
            }, () => {
                console.log('db not available');
            })
            .then(() => {
                mongoose.connection.close();
            });
    }
};
