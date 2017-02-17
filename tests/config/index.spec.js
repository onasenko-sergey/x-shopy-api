const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);
const expect = chai.expect;
const mockery = require('mockery');

describe('Function returned from configuration index file', function () {
    const moduleUnderTest = '../../config';
    let configModule;
    const development = { development: 'development', variable: 1 };
    const production = { production: 'production', variable: 2 };
    const test = { test: 'test', variable: 3 };

    before(function () {
        mockery.registerAllowable(moduleUnderTest);
        mockery.registerMock('./env/development', development);
        mockery.registerMock('./env/production', production);
        mockery.registerMock('./env/test', test);
        mockery.enable({ useCleanCache: true });
        configModule = require(moduleUnderTest);
    });

    after(function () {
        mockery.disable();
        mockery.deregisterAll();
    });

    context('called with no params', function () {
        let env;
        before(function () {
            // as far during testing NODE_ENV is set to 'test'
            env = process.env.NODE_ENV;
            process.env.NODE_ENV = '';
        });

        after(function () {
            process.env.NODE_ENV = env;
        });

        it('should return development environment configuration if NODE_ENV is not set', function () {
            const config = configModule();
            expect(config).to.eql(development);
        });

        it('should return configuration file matching NODE_ENV variable', function () {
            process.env.NODE_ENV = 'test';
            let config = configModule();
            expect(config.development).to.eql('development');
            expect(config.variable).to.equal(3);
            expect(config).to.containSubset(test);
            process.env.NODE_ENV = 'production';
            config = configModule();
            expect(config.development).to.eql('development');
            expect(config.variable).to.equal(2);
            expect(config).to.containSubset(production);
        });
    });

    context('called with "production"', function () {
        it('should override dev config with production env variables', function () {
            const config = configModule('production');
            expect(config.development).to.eql('development');
            expect(config.variable).to.equal(2);
            expect(config).to.containSubset(production);
        });
    });

    context('called with "test"', function () {
        it('should override dev config with tests env variables', function () {
            const config = configModule('test');
            expect(config.development).to.eql('development');
            expect(config.variable).to.equal(3);
            expect(config).to.containSubset(test);
        });
    });
});
