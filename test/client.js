'use strict'
const sinon = require('sinon')
const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const { ValidationError } = require('@hapi/joi')

const { expect } = Code
const { it, experiment, beforeEach, afterEach } = exports.lab = Lab.script()

const Drone = require('..')

const client = new Drone.Client({
  url: 'https://fakeurl.com',
  token: 'fake-token'
})

afterEach(() => sinon.restore())

experiment('getRepos', () => {
  beforeEach(() => {
    sinon.replace(client._axios, 'get', sinon.fake.returns('fake'))
    client.getRepos(1, 300)
  })

  it('sends the proper parameters to client', () => {
    expect(
      client._axios.get.lastCall.args
    ).to.equal([
      '/api/repos',
      { params: { page: 1, per_page: 300 } }
    ])
  })
})

experiment('getBuilds', () => {
  beforeEach(() => {
    sinon.replace(client._axios, 'get', sinon.fake.returns('fake'))
  })

  it('validates owner', () => {
    let error = null
    try {
      client.getBuilds()
    } catch (err) {
      error = err
    }
    expect(error).to.be.an.error(ValidationError, 'Must specify owner "value" is required')
  })

  it('validates repo', () => {
    let error = null
    try {
      client.getBuilds('drone')
    } catch (err) {
      error = err
    }
    expect(error).to.be.an.error(ValidationError, 'Must specify repo "value" is required')
  })

  it('sends proper params to server', () => {
    client.getBuilds('drone', 'drone-node', 2, 42)

    expect(
      client._axios.get.lastCall.args
    ).to.equal([
      '/api/repos/drone/drone-node/builds',
      { params: { page: 2, per_page: 42 } }
    ])
  })
})
