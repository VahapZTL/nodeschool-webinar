var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = require('../model/user');

describe('RESTful API Test', function () {

    var apiUrl = 'http://localhost:3000';
    var app = undefined;
    var token = "";

    beforeEach(function (done) {
        User.remove({email: {'$ne': 'integrationtest@gmail.com'}}, function (err) {
            if (err) {
                console.error("Error occurred while cleaning up user collection");
            }
            done();
        });
    });

    describe("User", function () {

        before(function (done) {
            app = require('../index.js');

            request(apiUrl)
                .post('/api/register')
                .send({
                name: 'Integration Test User',
                email: 'integrationtest@gmail.com',
                password: '12345'
            })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    if (res.body.success) {
                        request(apiUrl)
                            .post('/api/login')
                            .send({
                                email: 'integrationtest@gmail.com',
                                password: '12345'
                            })
                            .end(function(err, res) {
                                if (err) {
                                    throw err;
                                }
                                if (res.body.success) {
                                    token = 'Bearer ' + res.body.data;
                                    done();
                                } else {
                                    throw res.body.data;
                                }
                            })
                    }
                });
        });

        after(function(done) {
            User.remove({email: 'integrationtest@gmail.com'}, function (err) {
                if (err) {
                    console.error("Error occurred while cleaning up test user collection");
                }
                done();
            });
        });

        it('should return forbidden on empty token', function(done) {
            request(apiUrl)
                .get('/api/users')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.equal(401);
                    done()
                })
        });

        it('should return forbidden on invalid token', function(done) {
            request(apiUrl)
                .get('/api/users')
                .set('Authorization', 'abcd')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.equal(401);
                    done()
                })
        });
    });
});