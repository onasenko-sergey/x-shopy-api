const expect = require('chai').expect;
const mockery = require('mockery');
const sinon = require('sinon');

describe('Database connection function', function () {
    let consoleErrorStub, mongooseStub = {};
    const connection_string = 'my_connection_string';
    const connection_error = new Error('test');
    let databaseModule, connection;
    const moduleUnderTest = '../../config/database';

    before(function () {
        const p = Promise.reject(connection_error);
        mongooseStub.connect = sinon.stub().returns(p);
        mockery.registerAllowable(moduleUnderTest);
        mockery.registerMock('mongoose', mongooseStub);
        mockery.enable({ useCleanCache: true });
        databaseModule = require(moduleUnderTest);
        consoleErrorStub = sinon.stub(console, 'error');
        connection = databaseModule(connection_string);
    });

    after(function () {
        consoleErrorStub.restore();
        mockery.disable();
        mockery.deregisterAll();
    });

    it('should call mongoose.connect with received connection string', function () {
        expect(mongooseStub.connect.args[0][0]).to.equal(connection_string);
    });

    it('should call mongoose.connect with predefined options', function () {
        expect(mongooseStub.connect.args[0][1]).to.eql({
            server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
            replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }
        });
    });

    it('should return connect result(thenable | pseudo-promise)', function () {
        expect(connection).to.be.instanceof(Promise);
    });

    context('when connection error occurs', function () {
        it('should log error message', function () {
            expect(consoleErrorStub.calledWith('Mongoose connection error: ', connection_error.message)).to.be.ok;
        });

        it('should rethrow error', function (done) {
            connection.catch((err) => {
                expect(err).to.equal(connection_error);
                done();
            });
        });
    });
});
