'use strict'
const sinon = require('sinon')
const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const { ValidationError } = require('@hapi/joi')

const { expect } = Code
const { it, experiment, beforeEach, afterEach } = exports.lab = Lab.script()

const Drone = require('..')

/**
 * @param {string} method Method on the Client class
 */
const itValidatesRepoIdentification = (method) => {
  it('validates owner', () => {
    let error = null
    try {
      client[method].call(this)
    } catch (err) {
      error = err
    }
    expect(error).to.be.an.error(ValidationError, 'Must specify owner "value" is required')
  })

  it('validates repo', () => {
    let error = null
    try {
      client[method].call(this, 'drone')
    } catch (err) {
      error = err
    }
    expect(error).to.be.an.error(ValidationError, 'Must specify repo "value" is required')
  })
}

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

  itValidatesRepoIdentification('getBuilds')

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

experiment('selfRepos', () => {
  beforeEach(() => {
    sinon.replace(client._axios, 'get', sinon.fake.returns('fake'))
  })

  it('validates SelfRepos conditions', () => {
    let error = null
    try {
      client.selfRepos({ latest: null })
    } catch (err) {
      error = err
    }

    expect(error.message).to.contain(
      '"latest" must be a boolean'
    )
  })

  it('sends proper params to server', () => {
    client.selfRepos({ latest: true })

    expect(
      client._axios.get.lastCall.args
    ).to.equal([
      '/api/user/repos',
      { params: { latest: true } }
    ])
  })
})

experiment('getRepo', () => {
  beforeEach(() => {
    sinon.replace(client._axios, 'get', sinon.fake.returns('fake'))
  })

  itValidatesRepoIdentification('getRepo')

  it('sends proper params to server', () => {
    client.getRepo('drone', 'drone-node')

    expect(
      client._axios.get.lastCall.args
    ).to.equal([
      '/api/repos/drone/drone-node'
    ])
  })
})

experiment('enableRepo', () => {
  beforeEach(() => {
    sinon.replace(client._axios, 'post', sinon.fake.returns('fake'))
  })

  itValidatesRepoIdentification('getRepo')

  it('sends proper params to server', () => {
    client.enableRepo('drone', 'drone-node')

    expect(
      client._axios.post.lastCall.args
    ).to.equal([
      '/api/repos/drone/drone-node'
    ])
  })
})

experiment('disableRepo', () => {
  beforeEach(() => {
    sinon.replace(client._axios, 'delete', sinon.fake.returns('fake'))
  })

  itValidatesRepoIdentification('disableRepo')

  it('validates remove', () => {
    let error = null
    try {
      client.disableRepo('drone', 'drone-node', null)
    } catch (err) {
      error = err
    }
    expect(error).to.be.an.error(ValidationError, 'Must specify remove "value" must be a boolean')
  })

  it('sends proper params to server', () => {
    client.disableRepo('drone', 'drone-node', true)

    expect(
      client._axios.delete.lastCall.args
    ).to.equal([
      '/api/repos/drone/drone-node',
      {
        params: { remove: true }
      }
    ])
  })
})

experiment('chownRepo', () => {
  beforeEach(() => {
    sinon.replace(client._axios, 'post', sinon.fake.returns('fake'))
  })

  itValidatesRepoIdentification('chownRepo')

  it('sends proper params to server', () => {
    client.chownRepo('drone', 'drone-node')

    expect(
      client._axios.post.lastCall.args
    ).to.equal([
      '/api/repos/drone/drone-node/chown'
    ])
  })
})

experiment('repairRepo', () => {
  beforeEach(() => {
    sinon.replace(client._axios, 'post', sinon.fake.returns('fake'))
  })

  itValidatesRepoIdentification('repairRepo')

  it('sends proper params to server', () => {
    client.repairRepo('drone', 'drone-node', { visibility: 'thing' })

    expect(
      client._axios.post.lastCall.args
    ).to.equal([
      '/api/repos/drone/drone-node/repair'
    ])
  })
})

experiment('updateRepo', () => {
  beforeEach(() => {
    sinon.replace(client._axios, 'patch', sinon.fake.returns('fake'))
  })

  itValidatesRepoIdentification('updateRepo')

  it('validates remove', () => {
    let error = null
    try {
      client.updateRepo('drone', 'drone-node', { visibility: 42 })
    } catch (err) {
      error = err
    }

    expect(error.message).to.contain(
      '"visibility" must be a string'
    )
  })

  it('sends proper params to server', () => {
    client.updateRepo('drone', 'drone-node', { visibility: 'find legit values' })

    expect(
      client._axios.patch.lastCall.args
    ).to.equal([
      '/api/repos/drone/drone-node',
      { visibility: 'find legit values' }
    ])
  })
})
