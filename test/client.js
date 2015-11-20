'use strict';

const Drone = require('..');

const client = new Drone.Client({
    url: process.env.DRONE_SERVER,
    token: process.env.DRONE_TOKEN
});

const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const it = lab.test;

it('can get the current user', (done) => {

    client.getSelf().then((res) => {

        expect(res).to.be.an.object();
        expect(res).to.contain(['id', 'login', 'email', 'avatar_url', 'active', 'admin']);

        return done();
    }).catch(done);
});

it('can get a user by name', (done) => {

    client.getSelf().then((res) => {

        return client.getUser(res.login).then((user) => {

            expect(user).to.be.an.object();
            expect(user.login).to.equal(res.login);
            expect(user).to.contain(['id', 'login', 'email', 'avatar_url', 'active', 'admin']);

            return done();
        });
    }).catch(done);
});

it('can list users', (done) => {

    client.getUsers().then((users) => {

        expect(users).to.be.an.array();
        expect(users.length).to.be.above(0);

        for (const user of users) {
            expect(user).to.be.an.object();
            expect(user).to.contain(['id', 'login', 'email', 'avatar_url', 'active', 'admin']);
        }

        return done();
    }).catch(done);
});
