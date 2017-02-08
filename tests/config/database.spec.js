const expect = require('chai').expect;
const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');

describe('Database connection function', function () {
    let consoleErrorStub, mongooseStub = {};
    let databaseModule, connection_string, connection_error, connection;

    before(function () {
        databaseModule = proxyquire('../../config/database', { 'mongoose': mongooseStub });
        connection_string = 'my_connection_string';
        connection_error = new Error('test');
        const p = Promise.reject(connection_error);
        mongooseStub.connect = sinon.stub().returns(p);
        consoleErrorStub = sinon.stub(console, 'error');
        connection = databaseModule(connection_string);
    });

    after(function () {
        consoleErrorStub.restore();
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
