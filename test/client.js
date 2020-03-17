'use strict'

const Code = require('@hapi/code')
const Lab = require('@hapi/lab')

const { expect } = Code
const { it } = exports.lab = Lab.script()

const Drone = require('..')

const client = new Drone.Client({
  url: process.env.DRONE_SERVER,
  token: process.env.DRONE_TOKEN
})

it('can get the current user', (done) => {
  client.getSelf().then((res) => {
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

    return done()
  }).catch(done)
})
