'use strict'

const Code = require('@hapi/code')
const Lab = require('@hapi/lab')

const { expect } = Code
const { it, experiment } = exports.lab = Lab.script()

const Drone = require('..')

const client = new Drone.Client({
  url: process.env.DRONE_SERVER,
  token: process.env.DRONE_TOKEN
})

experiment('integration', () => {
  it('can get the current user', async () => {
    const res = await client.getSelf()
    expect(res).to.be.an.object()
    expect(res).to.contain([
      'id',
      'login',
      'email',
      'machine',
      'admin',
      'active',
      'avatar',
      'syncing',
      'synced',
      'created',
      'updated',
      'last_login'
    ])
  })

  it('can get recent builds', async () => {
    const res = await client.recentBuilds()
    expect(res).to.be.an.array()
    if (res.length) {
      res.forEach(r => {
        expect(r).to.contain([
          'id',
          'uid',
          'user_id',
          'namespace',
          'name',
          'slug',
          'scm',
          'git_http_url',
          'git_ssh_url',
          'link',
          'default_branch',
          'private',
          'visibility',
          'active',
          'config_path',
          'trusted',
          'protected',
          'ignore_forks',
          'ignore_pull_requests',
          'auto_cancel_pull_requests',
          'auto_cancel_pushes',
          'timeout',
          'counter',
          'synced',
          'created',
          'updated',
          'version'
        ])
        expect(r.build).to.contain([
          'id',
          'repo_id',
          'trigger',
          'number',
          'status',
          'event',
          'action',
          'link',
          'timestamp',
          'message',
          'before',
          'after',
          'ref',
          'source_repo',
          'source',
          'target',
          'author_login',
          'author_name',
          'author_email',
          'author_avatar',
          'sender',
          'started',
          'finished',
          'created',
          'updated',
          'version'
        ])
      })
    }
  })
})
