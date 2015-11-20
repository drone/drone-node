'use strict';

const Joi = require('joi');

const internals = {};
internals.timestamp = Joi.date().format('X');

exports.Event = Joi.string().valid('push',
                                   'pull_request',
                                   'tag',
                                   'deployment');

exports.Status = Joi.string().valid('skipped',
                                    'pending',
                                    'running',
                                    'success',
                                    'failure',
                                    'killed',
                                    'error');

exports.Arch = Joi.string().valid('freebsd_386',
                                  'freebsd_amd64',
                                  'freebsd_arm',
                                  'linux_386',
                                  'linux_amd64',
                                  'linux_arm',
                                  'linux_arm64',
                                  'solaris_amd64',
                                  'windows_386',
                                  'windows_amd64');

exports.User = Joi.object({
    id: Joi.number(),
    login: Joi.string(),
    email: Joi.string().email(),
    avatar_url: Joi.string().uri(),
    active: Joi.boolean(),
    admin: Joi.boolean()
});

exports.Repo = Joi.object({
    id: Joi.number(),
    owner: Joi.string(),
    name: Joi.string(),
    full_name: Joi.string(),
    avatar_url: Joi.string().uri(),
    link_url: Joi.string().uri(),
    clone_url: Joi.string().uri(),
    default_branch: Joi.string(),
    timeout: Joi.number().integer(),
    private: Joi.boolean(),
    trusted: Joi.boolean(),
    allow_pr: Joi.boolean(),
    allow_push: Joi.boolean(),
    allow_deploys: Joi.boolean(),
    allow_tags: Joi.boolean()
});

exports.Build = Joi.object({
    id: Joi.number(),
    number: Joi.number(),
    event: exports.Event,
    status: exports.Status,
    enqueued_at: internals.timestamp,
    created_at: internals.timestamp,
    started_at: internals.timestamp,
    finished_at: internals.timestamp,
    commit: Joi.string(),
    branch: Joi.string(),
    ref: Joi.string(),
    refspec: Joi.string(),
    remote: Joi.string(),
    title: Joi.string(),
    message: Joi.string(),
    timestamp: internals.timestamp,
    author: Joi.string(),
    author_avatar: Joi.string().uri(),
    author_email: Joi.string().email(),
    link_url: Joi.string().uri()
});

exports.Job = Joi.object({
    id: Joi.number(),
    number: Joi.number(),
    status: exports.Status,
    exit_code: Joi.number(),
    enqueued_at: internals.timestamp,
    started_at: internals.timestamp,
    finished_at: internals.timestamp,
    environment: Joi.object().pattern(/.*/, Joi.string())
});

exports.Activity = Joi.object({
    owner: Joi.string(),
    name: Joi.string(),
    full_name: Joi.string(),
    number: Joi.number(),
    event: exports.Event,
    status: exports.Status,
    enqueued_at: internals.timestamp,
    created_at: internals.timestamp,
    finished_at: internals.timestamp,
    commit: Joi.string(),
    branch: Joi.string(),
    ref: Joi.string(),
    refspec: Joi.string(),
    remote: Joi.string(),
    title: Joi.string(),
    message: Joi.string(),
    timestamp: internals.timestamp,
    author: Joi.string(),
    author_avatar: Joi.string().uri(),
    author_email: Joi.string().email(),
    link_url: Joi.string().uri()
});

exports.Node = Joi.object({
    id: Joi.number(),
    addr: Joi.string().uri(),
    architecture: exports.Arch,
    cert: Joi.string(),
    key: Joi.string(),
    ca: Joi.string()
});

exports.Key = Joi.object({
    public: Joi.string(),
    private: Joi.string()
});

exports.Netrc = Joi.object({
    machine: Joi.string(),
    login: Joi.string(),
    password: Joi.string()
});

exports.System = Joi.object({
    version: Joi.string(),
    link_url: Joi.string().uri(),
    plugins: Joi.array().items(Joi.string()),
    globals: Joi.array().items(Joi.string())
});

exports.Workspace = Joi.object({
    root: Joi.string(),
    path: Joi.string(),
    netrc: exports.Netrc,
    keys: exports.Key
});
