//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
var userModel = require('../app/models/user');

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


//Main block , register a user first
describe('users thumbnail and json patch Test', () => {
	var token = '';
	var userId = '';
	var numberId = '';
    before((done) => { //Before each test we empty the database
    	var user = new userModel({
    		name  : 'Abhijeet juneja',
    		email : 'abcas@gmail.com',
    		password : 'abcABC1@'
    	});
    	user.save(function(err,user){            
            if (err) throw new Error('Expected not to receive an error');
            else{
            	userId = user._id;
                done();
            }
        });


    });

    //Login with invalid email and password
    describe('LOGIN user', () => {
      it('it should not login user with invalid email and password', (done) => {
        var user = {
            email : 'abcas@gmail.com',
    		password : 'abcABC1asdd@'
        }
        chai.request(server)
            .post('/users/login')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(user)
            .end((err, res) => {
            	if (err) throw new Error('Expected not to receive an error');
            	res.body.message.should.equal('Could not authenticate password.Invalid password');
                res.body.should.be.a('object');
                res.body.should.have.property('error');
              done();
            });
      });

    });

    //Login with valid email and password
    describe('LOGIN user', () => {
      it('it should login user with valid email and password', (done) => {
        var user = {
            email : 'abcas@gmail.com',
    		password : 'abcABC1@'
        }
        chai.request(server)
            .post('/users/login')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set('x-access-token',token)
            .send(user)
            .end((err, res) => {
            	if (err) throw new Error('Expected not to receive an error');
            	token  = res.body.token;
            	res.body.message.should.equal('Login Successfull');
                res.body.should.be.a('object');
                res.body.should.have.property('error');
              done();
            });
      });

    });

    //Get details of user without token
    describe('Get Details user', () => {
      it('it should return error as user is not logged in', (done) => {
        chai.request(server)
            .get('/users/me')
            .set('content-type', 'application/x-www-form-urlencoded')
            .end((err, res) => {
            	res.body.message.should.equal('No token provided');
                res.body.should.be.a('object');
                res.body.should.have.property('error');
              done();
            });
      });

    });

    //Get details of user with token
    describe('Get Details user', () => {
      it('it should return user details as user is logged in', (done) => {
        chai.request(server)
            .get('/users/me')
            .set('x-access-token',token)
            .end((err, res) => {
            	if (err) throw new Error('Expected not to receive an error');
                res.body.should.be.a('object');
                res.body.should.have.property('name');
              done();
            });
      });

    });


    //Create thumbnail without token
    describe('Create Thumbnail (Protected)', () => {
      it('it should not create thumbnail as token is not provided', (done) => {
        chai.request(server)
            .post('/thumbnails/create')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({url : 'https://ichef.bbci.co.uk/images/ic/480x270/p05394v7.jpg'})
            .end((err, res) => {
                res.body.message.should.equal('No token provided');
                res.body.should.be.a('object');
              done();
            });
      });

    });

    //Create thumbnail with invalid token 
    describe('Create Thumbnail (Protected)', () => {
      it('it should not create thumbnail as token is invalid', (done) => {
        chai.request(server)
            .post('/thumbnails/create')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set('x-access-token','assf')
            .send({url : 'https://ichef.bbci.co.uk/images/ic/480x270/p05394v7.jpg'})
            .end((err, res) => {
                res.body.message.should.equal('Invalid Token');
                res.body.should.be.a('object');
              done();
            });
      });

    });

    //Create thumbnail with invalid url
    describe('Create Thumbnail (Protected)', () => {
      it('it should create thumbnail as url is invalid', (done) => {
        chai.request(server)
            .post('/thumbnails/create')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set('x-access-token',token)
            .send({url : '123'})
            .end((err, res) => {
                res.body.message.should.equal('Invalid Url');
                res.body.should.be.a('object');
              done();
            });
      });

    });

    //Create thumbnail with valid token
    describe('Create Thumbnail (Protected)', () => {
      it('it should create thumbnail as token is provided', (done) => {
        chai.request(server)
            .post('/thumbnails/create')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set('x-access-token',token)
            .send({url : 'https://ichef.bbci.co.uk/images/ic/480x270/p05394v7.jpg'})
            .end((err, res) => {
                res.body.message.should.equal('Thumbnail Generated');
                res.body.should.be.a('object');
              done();
            });
      });

    });

    //Apply json patch without token
    describe('Apply JSON Patch (Protected)', () => {
      it('it should not apply json patch as token is not provided', (done) => {
        chai.request(server)
            .post('/jsonpatch/apply')
            .set('content-type', 'application/json')
            .send({"json" : {"avc":"sdsd"}, "jsonPatch" : [{ "op": "add", "path": "/hello", "value": ["world"]}]})
            .end((err, res) => {
                res.body.message.should.equal('No token provided');
                res.body.should.be.a('object');
              done();
            });
      });

    });

    //Apply json patch with invalid token
    describe('Apply JSON Patch (Protected)', () => {
      it('it should not apply json patch as token is invalid', (done) => {
        chai.request(server)
            .post('/jsonpatch/apply')
            .set('content-type', 'application/json')
            .set('x-access-token','fgfg')
            .send({"json" : {"avc":"sdsd"}, "jsonPatch" : [{ "op": "add", "path": "/hello", "value": ["world"]}]})
            .end((err, res) => {
                res.body.message.should.equal('Invalid Token');
                res.body.should.be.a('object');
              done();
            });
      });

    });

    //Apply json patch with invalid json
    describe('Apply JSON Patch (Protected)', () => {
      it('it should not apply json patch as json is invalid', (done) => {
        chai.request(server)
            .post('/jsonpatch/apply')
            .set('content-type', 'application/json')
            .set('x-access-token',token)
            .send({"json" : "avc", "jsonPatch" : [{ "op": "add", "path": "/hello", "value": ["world"]}]})
            .end((err, res) => {
                res.body.message.should.equal('Invalid Json');
                res.body.should.be.a('object');
              done();
            });
      });

    });

    //Apply json patch with invalid jsonPatch
    describe('Apply JSON Patch (Protected)', () => {
      it('it should not apply json patch as jsonPatch is invalid', (done) => {
        chai.request(server)
            .post('/jsonpatch/apply')
            .set('content-type', 'application/json')
            .set('x-access-token',token)
            .send({"json" : {"avc":"sdsd"}, "jsonPatch" : { "op": "add", "path": "/hello", "value": ["world"]}})
            .end((err, res) => {
                res.body.message.should.equal('Invalid Json Patch');
                res.body.should.be.a('object');
              done();
            });
      });

    });

    //Apply json patch with valid body and token
    describe('Apply JSON Patch (Protected)', () => {
      it('it should apply json patch as token is provided and body is valid', (done) => {
        chai.request(server)
            .post('/jsonpatch/apply')
            .set('content-type', 'application/json')
            .set('x-access-token',token)
            .send({"json" : {"avc":"sdsd"}, "jsonPatch" : [{ "op": "add", "path": "/hello", "value": ["world"]}]})
            .end((err, res) => {
                res.body.message.should.equal('Json Patched');
                res.body.should.be.a('object');
              done();
            });
      });

    });


    

    after((done) => {
    	userModel.remove({}, (err) => { 
            if (err) throw new Error('Expected not to receive an error');
            done();
        });     
    });

});
