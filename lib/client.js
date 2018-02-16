'use strict';

const Joi = require('joi');
const debug = require('debug')('drone-node');
const Types = require('./types');
const Wreck = require('wreck');

const internals = {};
internals.schema = Joi.object({
    url: Joi.string().uri({ scheme: /https?/ }).required(),
    token: Joi.string().required()
});

class DroneClient {
    constructor(config) {

        Joi.assert(config, internals.schema);
        this._wreck = Wreck.defaults({
            baseUrl: config.url,
            headers: {
                Authorization: `Bearer ${config.token}`
            }
        });

        this._request = (method, url, options) => {

            debug('start request', method, url, options);

            return new Promise((resolve, reject) => {

                this._wreck.request(method, url, options, (err, res) => {

                    if (err) {
                        return reject(err);
                    }

                    debug('response status code', res.statusCode);

                    if (res.statusCode < 200 ||
                        res.statusCode >= 300) {

                        const e = new Error('Invalid response code: ' + res.statusCode);
                        e.statusCode = res.statusCode;
                        e.headers = res.headers;
                        return reject(e);
                    }

                    this._wreck.read(res, { json: true }, (err, payload) => {

                        if (err) {
                            return reject(err);
                        }

                        return resolve(payload);
                    });
                });
            });
        };
    };

    getSelf() {

        return this._request('get', '/api/user');
    };

    getFeed() {

        return this._request('get', '/api/user/feed');
    };

    getUser(login) {

        Joi.assert(login, Joi.string().required(), 'Must specify login');
        return this._request('get', `/api/users/${login}`);
    };

    getUsers() {

        return this._request('get', '/api/users');
    };

    createUser(user) {

        Joi.assert(user, Types.User, 'Invalid user object');
        return this._request('post', '/api/users', { payload: JSON.stringify(user) });
    };

    updateUser(user) {

        Joi.assert(user, Types.User, 'Invalid user object');
        return this._request('patch', '/api/users', { payload: JSON.stringify(user) });
    };

    deleteUser(login) {

        Joi.assert(login, Joi.string().required(), 'Must specify login');
        return this._request('delete', `/api/users/${login}`);
    };

    getRepo(owner, name) {

        Joi.assert(owner, Joi.string().required(), 'Must specify owner');
        Joi.assert(name, Joi.string().required(), 'Must specify name');
        return this._request('get', `/api/repos/${owner}/${name}`);
    };

    getRepos() {

        return this._request('get', '/api/user/repos');
    };

    createRepo(owner, name) {

        Joi.assert(owner, Joi.string().required(), 'Must specify owner');
        Joi.assert(name, Joi.string().required(), 'Must specify name');
        return this._request('post', `/api/repos/${owner}/${name}`);
    };

    updateRepo(repo) {

        Joi.assert(repo, Types.Repo, 'Invalid repo object');
        return this._request('patch', `/api/repos/${owner}/${name}`, { payload: JSON.stringify(repo) });
    };

    deleteRepo(owner, name) {

        Joi.assert(owner, Joi.string().required(), 'Must specify owner');
        Joi.assert(name, Joi.string().required(), 'Must specify name');
        return this._request('delete', `/api/repos/${owner}/${name}`);
    };

    getRepoKey(owner, name) {

        Joi.assert(owner, Joi.string().required(), 'Must specify owner');
        Joi.assert(name, Joi.string().required(), 'Must specify name');
        return this._request('get', `/api/repos/${owner}/${name}/key`);
    };

    getBuild(owner, name, num) {

        Joi.assert(owner, Joi.string().required(), 'Must specify owner');
        Joi.assert(name, Joi.string().required(), 'Must specify name');
        Joi.assert(num, Joi.number().required(), 'Must specify num');
        return this._request('get', `/api/repos/${owner}/${name}/builds/${num}`);
    };

    getLastBuild(owner, name) {

        Joi.assert(owner, Joi.string().required(), 'Must specify owner');
        Joi.assert(name, Joi.string().required(), 'Must specify name');
        return this._request('get', `/api/repos/${owner}/${name}/builds/latest`);
    };

    getBuilds(owner, name) {

        Joi.assert(owner, Joi.string().required(), 'Must specify owner');
        Joi.assert(name, Joi.string().required(), 'Must specify name');
        return this._request('get', `/api/repos/${owner}/${name}/builds`);
    };

    restartBuild(owner, name, num) {

        Joi.assert(owner, Joi.string().required(), 'Must specify owner');
        Joi.assert(name, Joi.string().required(), 'Must specify name');
        Joi.assert(num, Joi.number().required(), 'Must specify num');
        return this._request('post', `/api/repos/${owner}/${name}/builds/${num}`);
    };

    stopBuild(owner, name, num, job) {

        Joi.assert(owner, Joi.string().required(), 'Must specify owner');
        Joi.assert(name, Joi.string().required(), 'Must specify name');
        Joi.assert(num, Joi.number().required(), 'Must specify num');
        Joi.assert(job, Joi.number().required(), 'Must specify job');
        return this._request('post', `/api/repos/${owner}/${name}/builds/${num}/${job}`);
    };

    forkBuild(owner, name, num) {

        Joi.assert(owner, Joi.string().required(), 'Must specify owner');
        Joi.assert(name, Joi.string().required(), 'Must specify name');
        Joi.assert(num, Joi.number().required(), 'Must specify num');
        return this._request('post', `/api/repos/${owner}/${name}/builds/${num}?fork=true`);
    };

    getBuildLogs(owner, name, num, job) {

        Joi.assert(owner, Joi.string().required(), 'Must specify owner');
        Joi.assert(name, Joi.string().required(), 'Must specify name');
        Joi.assert(num, Joi.number().required(), 'Must specify num');
        Joi.assert(job, Joi.number().required(), 'Must specify job');
        return this._request('get', `/api/repos/${owner}/${name}/logs/${num}/${job}`);
    };

    getNode(id) {

        Joi.assert(id, Joi.number().required(), 'Must specify id');
        return this._request('get', `/api/nodes/${id}`);
    };

    getNodes() {

        return this._request('get', '/api/nodes');
    };

    createNode(node) {

        Joi.assert(node, Types.Node, 'Invalid node object');
        return this._request('post', '/api/nodes', { payload: JSON.stringify(node) });
    };

    deleteNode(id) {

        Joi.assert(id, Joi.number().required(), 'Must specify id');
        return this._request('delete', `/api/nodes/${id}`);
    };
};

module.exports = DroneClient;
