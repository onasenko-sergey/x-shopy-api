const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);
const expect = chai.expect;
const rewire = require('rewire');

describe('Configuration index file', function () {
    let configModule;
    const development = { development: 'development', variable: 1 };
    const production = { production: 'production', variable: 2 };
    const test = { test: 'test', variable: 3 };

    before(function () {
        configModule = rewire('../config');
        configModule.__set__('development', development);
        configModule.__set__('production', production);
        configModule.__set__('test', test);
    });

    context('by default', function () {
        it('should return development environment configuration', function () {
            const config = configModule();
            expect(config).to.eql(development);
        });
    });

    context('called with "production"', function () {
        it('should override dev config with production env variables', function () {
            const config = configModule('production');
            expect(config.variable).to.equal(2);
            expect(config).to.containSubset(production);
        });
    });

    context('called with "test"', function () {
        it('should override dev config with tests env variables', function () {
            const config = configModule('test');
            expect(config.variable).to.equal(3);
            expect(config).to.containSubset(test);
        });
    });
});
