//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var httpMocks = require('node-mocks-http');
var server = require('../server');
var should = chai.should();
var responseGenerator = require('../libs/responseGenerator');
var detail = require('../middlewares/getDetails');

chai.use(chaiHttp);


//Our parent block
describe('Unit Tests', () => {

    //Get details module which check for JWT Token
    describe('getDetails module', () => {
        var request = httpMocks.createRequest({
                method: 'GET'
            });
        var response = httpMocks.createResponse();

        //Provide no token
        it('it should return 404 as no token is provided', (done) => {
            detail.getDetails(request, response , function(next){
                throw new Error('Expected not to receive an error');
            });
            expect(response.statusCode).to.equal(404);
            done();
        });

        var req = httpMocks.createRequest({
                method: 'GET',
                headers: {
                    'x-access-token' :'sfdfdfdfd'
                }
            });

        //Provide invalid token
        it('it should return 401 as token is invalid', (done) => {
            detail.getDetails(req, response , function(next){
                throw new Error('Expected not to receive an error');
            });
            expect(response.statusCode).to.equal(401);
            done();
            
        });
    });


});

