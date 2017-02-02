const expect = require('chai').expect;
const request = require('supertest');
let app = require('../app');

let agent = request.agent(app);

describe('Root route request', function () {
    it('should return http status 200', function (done) {
        agent.get('/').expect(200, done);
    });

    it('should return { title: "Express" }', function (done) {
        agent.get('/').expect(200, {title: 'Express'}, done);
    });
});

describe('Unknown route request', function () {
    it('should return http status 404', function (done) {
        agent.get('/random').expect(404, done);
    });

    it('should return empty body', function (done) {
        agent.get('/random').end(function (err, res) {
            expect(res.body).to.be.empty;
            done();
        });
    });

    describe('in development', function () {

        before(function () {
            app.set('env', 'development');
        });

        it('should return "Not found" error message', function (done) {
            agent.get('/random').end(function (err, res) {
                expect(res.body.error.message).to.equal('Not Found');
                done();
            });
        });

        it('should return error stack', function (done) {
            agent.get('/random').end(function (err, res) {
                expect(res.body.error.stack).to.be.not.empty;
                done();
            });
        });
    });
});
