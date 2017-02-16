const expect = require('chai').expect;
const mockery = require('mockery');
const sinon = require('sinon');

describe('Passport JWT authentication strategy', function () {
    let passportStub = {}, passportJwtStub = {}, UserStub = {}, configStub = {};
    let passportModule;
    const moduleUnderTest = '../../config/passport';

    before(function () {
        passportStub.use = sinon.stub();
        passportJwtStub = {
            Strategy: function () {
                this.strategy = 'test';
            }
        };
        sinon.spy(passportJwtStub, 'Strategy');
        UserStub.findOne = sinon.stub();
        configStub = sinon.stub().returns({ jwt_secret: 'test' });
        mockery.registerAllowable(moduleUnderTest);
        mockery.registerMock('passport', passportStub);
        mockery.registerMock('passport-jwt', passportJwtStub);
        mockery.registerMock('../db/models/User', UserStub);
        mockery.registerMock('./index', configStub);
        mockery.enable({ useCleanCache: true });
        passportModule = require(moduleUnderTest);
    });

    after(function () {
        mockery.disable();
        mockery.deregisterAll();
    });

    context('options', function () {
        it('secret key should be received from config', function () {
            expect(configStub.calledOnce).to.be.ok;
            expect(passportModule.opts.secretOrKey).to.equal('test');
        });

        it('jwt should be retrieved from request cookies', function () {
            const testRequest = { cookies: { Authorization: 'jwt' } };
            expect(passportModule.opts.jwtFromRequest(testRequest)).to.equal('jwt');
        });
    });

    context('verify method', function () {
        it('should request `User` collection for user with id equal to jwt payload subject', function () {
            passportModule.verify({ sub: 'test' }, function (err, user) {});
            expect(UserStub.findOne.calledOnce).to.be.ok;
            expect(UserStub.findOne.calledWith({ _id: 'test' })).to.be.ok;
        });

        it('should call cb with err if error occurs', function () {
            UserStub.findOne.withArgs({ _id: 'test' }).callsArgWith(1, new Error('test'));
            passportModule.verify({ sub: 'test' }, function (err) {
                expect(err.message).to.equal('test');
            });
        });

        it('should call cb with user found', function () {
            UserStub.findOne.withArgs({ _id: 'test' }).callsArgWith(1, null, { name: 'test'});
            passportModule.verify({ sub: 'test' }, function (err, user) {
                expect(user.name).to.equal('test');
            });
        });

        it('should call cb with `false` if user does not exist', function () {
            UserStub.findOne.withArgs({ _id: 'test' }).callsArgWith(1, null, false);
            passportModule.verify({ sub: 'test' }, function (err, user) {
                expect(user).to.be.false;
            });
        });
    });

    it('should be called with exact options and verify method', function () {
        expect(passportJwtStub.Strategy.calledWith(
            passportModule.opts,
            passportModule.verify
        )).to.be.ok;
        expect(passportStub.use.calledWith({ strategy: 'test' })).to.be.ok;
    });
});
