'use strict'

const Joi = require('@hapi/joi')
const Axios = require('axios')
const Querystring = require('querystring')

/**
 * Drone client
 */
class Client {
  /**
   * @constructor
   * @param {object} config Client config
   */
  constructor (config) {
    Joi.assert(
      config,
      Joi.object({
        url: Joi.string().uri({ scheme: /https?/ }).required(),
        token: Joi.string().required()
      })
    )

    this._axios = Axios.create({
      baseURL: config.url,
      headers: {
        Authorization: `Bearer ${config.token}`
      }
    })
    this._axios.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error.toJSON())
    )
  }

  /**
   * Get token
   */
  getToken () {
    return this._axios.post(
      '/api/user/token'
    )
  }

  /**
   * Get self
   */
  getSelf () {
    return this._axios.get(
      '/api/user'
    )
  }

  /**
   * Recent repos
   */
  recentBuilds () {
    return this._axios.get(
      '/api/user/builds'
    )
  }

  /**
   * Sync repos
   * @param {SyncRepos} params Filter parameters
   */
  syncRepos (params) {
    return this._axios.post(
      '/api/user/repos',
      Querystring.stringify(params)
    )
  }

  /**
   * Update self
   * @param {User} self Changes to apply
   */
  updateSelf (self) {
    Joi.assert(self, User, 'Must specify self')

    return this._axios.patch(
      '/api/user',
      self
    )
  }

  /**
   * Self repos
   * @param {SelfRepos} params Filter parameters
   */
  selfRepos (params) {
    Joi.assert(params, SelfRepos, 'Specify valid params')

    return this._axios.get(
      '/api/user/repos', {
        params: params
      })
  }

  /**
   * Get repos
   * @param {integer} page Page number
   * @param {integer} limit Page limit
   * Ref: https://github.com/harness/drone/blob/v2.11.1/handler/api/repos/all.go
   */
  getRepos (page = 1, limit = 10000) {
    return this._axios.get(
      '/api/repos', {
        params: {
          page: page,
          per_page: limit
        }
      })
  }

  /**
   * Get repo
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * Ref: https://github.com/harness/drone/blob/v2.11.1/handler/api/repos/find.go
   */
  getRepo (owner, repo) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')

    return this._axios.get(
            `/api/repos/${owner}/${repo}`
    )
  }

  /**
   * Enable repo
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * Ref: https://github.com/harness/drone/blob/v2.11.1/handler/api/repos/enable.go
   */
  enableRepo (owner, repo) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')

    return this._axios.post(
            `/api/repos/${owner}/${repo}`
    )
  }

  /**
   * Disable repo
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * Ref: https://github.com/harness/drone/blob/v2.11.1/handler/api/repos/disable.go
   */
  disableRepo (owner, repo, remove = false) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(remove, Joi.boolean().required(), 'Must specify remove')

    return this._axios.delete(
            `/api/repos/${owner}/${repo}`, {
              params: {
                remove: remove
              }
            })
  }

  /**
   * Chown repo
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   */
  chownRepo (owner, repo) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')

    return this._axios.post(
            `/api/repos/${owner}/${repo}/chown`
    )
  }

  /**
   * Repair repo
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * Ref: https://github.com/harness/drone/blob/v2.11.1/handler/api/repos/repair.go
   */
  repairRepo (owner, repo) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')

    return this._axios.post(
            `/api/repos/${owner}/${repo}/repair`
    )
  }

  /**
   * Update repo
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {RepoSettings} settings Settings to update
   * Ref: https://github.com/harness/drone/blob/v2.11.1/handler/api/repos/update.go
   */
  updateRepo (owner, repo, settings) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(settings, RepoSettings, 'Must specify settings')

    return this._axios.patch(
            `/api/repos/${owner}/${repo}`,
            settings
    )
  }

  /**
   * Incomplete builds
   */
  incompleteBuilds () {
    return this._axios.get(
      '/api/builds/incomplete'
    )
  }

  /**
   * Get builds
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {integer} page Page number
   * @param {integer} limit Page limit
   * Ref: https://github.com/harness/drone/blob/v2.11.1/handler/api/repos/builds/list.go
   */
  getBuilds (owner, repo, page = 1, limit = 25) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')

    return this._axios.get(
      `/api/repos/${owner}/${repo}/builds`, {
        params: {
          page: page,
          per_page: limit
        }
      })
  }

  /**
   * Purge builds
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {integer} before Purge before build
   */
  purgeBuilds (owner, repo, before) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(before, Joi.number().required(), 'Must specify before')

    return this._axios.delete(
            `/api/repos/${owner}/${repo}/builds`, {
              params: {
                before: before
              }
            })
  }

  /**
   * Latest build by ref
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {LatestBuild} params Filter by ref or branch
   */
  latestBuild (owner, repo, params) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(params, LatestBuild, 'Specify valid params')

    return this._axios.get(
            `/api/repos/${owner}/${repo}/builds/latest`, {
              params: params
            })
  }

  /**
   * Get build
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {integer} number Number of the build
   */
  getBuild (owner, repo, number) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(number, Joi.number().required(), 'Must specify number')

    return this._axios.get(
            `/api/repos/${owner}/${repo}/builds/${number}`
    )
  }

  /**
   * Retry build
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {integer} number Number of the build
   * @param {RetryBuild} params Build parameters
   */
  retryBuild (owner, repo, number, params) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(number, Joi.number().required(), 'Must specify number')
    Joi.assert(params, RetryBuild, 'Specify valid params')

    return this._axios.post(
            `/api/repos/${owner}/${repo}/builds/${number}`,
            Querystring.stringify(params)
    )
  }

  /**
   * Cancel build
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {integer} number Number of the build
   */
  cancelBuild (owner, repo, number) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(number, Joi.number().required(), 'Must specify number')

    return this._axios.delete(
            `/api/repos/${owner}/${repo}/builds/${number}`
    )
  }

  /**
   * Promote build
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {integer} number Number of the build
   * @param {string} target Promote target
   * @param {object} params Build parameters
   */
  promoteBuild (owner, repo, number, target, params) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(number, Joi.number().required(), 'Must specify number')
    Joi.assert(target, Joi.string().required(), 'Must specify target')
    Joi.assert(params, Joi.object().pattern(/.*/, Joi.string()), 'Specify valid params')

    return this._axios.post(
      `/api/repos/${owner}/${repo}/builds/${number}/promote`,
      undefined,
      { params: Object.assign({ target: target }, params) }
    )
  }

  /**
   * Rollback build
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {integer} number Number of the build
   * @param {string} target Promote target
   * @param {object} params Build parameters
   */
  rollbackBuild (owner, repo, number, target, params) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(number, Joi.number().required(), 'Must specify number')
    Joi.assert(target, Joi.string().required(), 'Must specify target')
    Joi.assert(params, Joi.object().pattern(/.*/, Joi.string()), 'Specify valid params')

    return this._axios.post(
            `/api/repos/${owner}/${repo}/builds/${number}/rollback`,
            Querystring.stringify(
              Object.assign(
                { target: target },
                params
              )
            )
    )
  }

  /**
   * Decline build
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {integer} number Number of the build
   * @param {integer} stage Stage of the build
   */
  declineBuild (owner, repo, number, stage) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(number, Joi.number().required(), 'Must specify number')
    Joi.assert(stage, Joi.number().required(), 'Must specify stage')

    return this._axios.post(
            `/api/repos/${owner}/${repo}/builds/${number}/decline/${stage}`
    )
  }

  /**
   * Approve build
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {integer} number Number of the build
   * @param {integer} stage Stage of the build
   */
  approveBuild (owner, repo, number, stage) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(number, Joi.number().required(), 'Must specify number')
    Joi.assert(stage, Joi.number().required(), 'Must specify stage')

    return this._axios.post(
            `/api/repos/${owner}/${repo}/builds/${number}/approve/${stage}`
    )
  }

  /**
   * Trigger build
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {TriggerBuild} params Filter by branch and commit
   */
  triggerBuild (owner, repo, params) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(params, TriggerBuild, 'Specify valid params')

    return this._axios.post(
            `/api/repos/${owner}/${repo}/builds`,
            undefined,
            { params: params }
    )
  }

  /**
   * Get logs
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {integer} number Number of the build
   * @param {integer} stage Stage of the build
   * @param {integer} step Step of the build
   */
  getLogs (owner, repo, number, stage, step) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(number, Joi.number().required(), 'Must specify number')
    Joi.assert(stage, Joi.number().required(), 'Must specify stage')
    Joi.assert(step, Joi.number().required(), 'Must specify step')

    return this._axios.get(
            `/api/repos/${owner}/${repo}/builds/${number}/logs/${stage}/${step}`
    )
  }

  /**
   * Delete logs
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {integer} number Number of the build
   * @param {integer} stage Stage of the build
   * @param {integer} step Step of the build
   */
  deleteLogs (owner, repo, number, stage, step) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(number, Joi.number().required(), 'Must specify number')
    Joi.assert(stage, Joi.number().required(), 'Must specify stage')
    Joi.assert(step, Joi.number().required(), 'Must specify step')

    return this._axios.delete(
            `/api/repos/${owner}/${repo}/builds/${number}/logs/${stage}/${step}`
    )
  }

  /**
   * Get secrets
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   */
  getSecrets (owner, repo) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')

    return this._axios.get(
            `/api/repos/${owner}/${repo}/secrets`
    )
  }

  /**
   * Get secret
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {string} name Name of the secret
   */
  getSecret (owner, repo, name) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(name, Joi.string().required(), 'Must specify name')

    return this._axios.get(
            `/api/repos/${owner}/${repo}/secrets/${name}`
    )
  }

  /**
   * Delete secret
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {string} name Name of the secret
   */
  deleteSecret (owner, repo, name) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(name, Joi.string().required(), 'Must specify name')

    return this._axios.delete(
            `/api/repos/${owner}/${repo}/secrets/${name}`
    )
  }

  /**
   * Update secret
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {string} name Name of the secret
   * @param {Secret} secret Secret to update
   */
  updateSecret (owner, repo, name, secret) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(name, Joi.string().required(), 'Must specify name')
    Joi.assert(secret, Secret.required(), 'Must specify secret')

    return this._axios.patch(
            `/api/repos/${owner}/${repo}/secrets/${name}`,
            secret
    )
  }

  /**
   * Create secret
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {Secret} secret Secret to create
   */
  createSecret (owner, repo, secret) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(secret, Secret.required(), 'Must specify secret')

    return this._axios.post(
            `/api/repos/${owner}/${repo}/secrets`,
            secret
    )
  }

  /**
   * Encrypt secret
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {string} secret Secret to encrypt
   */
  encryptSecret (owner, repo, secret) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(secret, Joi.string().required(), 'Must specify secret')

    return this._axios.post(
            `/api/repos/${owner}/${repo}/encrypt`,
            { data: secret }
    )
  }

  /**
   * Sign config
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {string} config Config to sign
   */
  signConfig (owner, repo, config) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(config, Joi.string().required(), 'Must specify config')

    return this._axios.post(
            `/api/repos/${owner}/${repo}/sign`,
            { data: config }
    )
  }

  /**
   * Get crons
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   */
  getCrons (owner, repo) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')

    return this._axios.get(
            `/api/repos/${owner}/${repo}/cron`
    )
  }

  /**
   * Get cron
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {string} cron Name of the cron
   */
  getCron (owner, repo, cron) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(cron, Joi.string().required(), 'Must specify cron')

    return this._axios.get(
            `/api/repos/${owner}/${repo}/cron/${cron}`
    )
  }

  /**
   * Execute cron
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {string} name Name of the cron
   */
  executeCron (owner, repo, name) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(name, Joi.string().required(), 'Must specify name')

    return this._axios.post(
            `/api/repos/${owner}/${repo}/cron/${name}`
    )
  }

  /**
   * Delete cron
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {string} name Name of the cron
   */
  deleteCron (owner, repo, name) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(name, Joi.string().required(), 'Must specify name')

    return this._axios.delete(
            `/api/repos/${owner}/${repo}/cron/${name}`
    )
  }

  /**
   * Update cron
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {string} name Name of the cron
   * @param {Cron} cron Cron to update
   */
  updateCron (owner, repo, name, cron) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(name, Joi.string().required(), 'Must specify name')
    Joi.assert(cron, Cron.required(), 'Must specify cron')

    return this._axios.patch(
            `/api/repos/${owner}/${repo}/cron/${name}`,
            cron
    )
  }

  /**
   * Create cron
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {Cron} cron Cron to create
   */
  createCron (owner, repo, cron) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(cron, Cron.required(), 'Must specify cron')

    return this._axios.post(
            `/api/repos/${owner}/${repo}/cron`,
            cron
    )
  }

  /**
   * Get collaborators
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   */
  getCollaborators (owner, repo) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')

    return this._axios.get(
            `/api/repos/${owner}/${repo}/collaborators`
    )
  }

  /**
   * Get collaborator
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {string} name Name of the member
   */
  getCollaborator (owner, repo, name) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(name, Joi.string().required(), 'Must specify name')

    return this._axios.get(
            `/api/repos/${owner}/${repo}/collaborators/${name}`
    )
  }

  /**
   * Delete collaborator
   * @param {string} owner Owner of the repo
   * @param {string} repo Name of the repo
   * @param {string} name Name of the member
   */
  deleteCollaborator (owner, repo, name) {
    Joi.assert(owner, Joi.string().required(), 'Must specify owner')
    Joi.assert(repo, Joi.string().required(), 'Must specify repo')
    Joi.assert(name, Joi.string().required(), 'Must specify name')

    return this._axios.delete(
            `/api/repos/${owner}/${repo}/collaborators/${name}`
    )
  }

  /**
   * Get users
   */
  getUsers () {
    return this._axios.get(
      '/api/users'
    )
  }

  /**
   * Get user
   * @param {string} name Name of the user
   */
  getUser (name) {
    Joi.assert(name, Joi.string().required(), 'Must specify name')

    return this._axios.get(
            `/api/users/${name}`
    )
  }

  /**
   * Delete user
   * @param {string} name Name of the user
   */
  deleteUser (name) {
    Joi.assert(name, Joi.string().required(), 'Must specify name')

    return this._axios.delete(
            `/api/users/${name}`
    )
  }

  /**
   * Update user
   * @param {string} name Name of the user
   * @param {User} user User to update
   */
  updateUser (name, user) {
    Joi.assert(name, Joi.string().required(), 'Must specify name')
    Joi.assert(user, User.required(), 'Must specify user')

    return this._axios.patch(
            `/api/users/${name}`,
            user
    )
  }

  /**
   * Create user
   * @param {User} user User to create
   */
  createUser (user) {
    Joi.assert(user, User.required(), 'Must specify user')

    return this._axios.post(
      '/api/users',
      user
    )
  }

  /**
   * User repos
   * @param {string} name Name of the user
   */
  userRepos (name) {
    Joi.assert(name, Joi.string().required(), 'Must specify name')

    return this._axios.get(
            `/api/users/${name}/repos`
    )
  }

  /**
   * Get a list of all global secrets
   */
  getAllGlobalSecrets () {
    return this._axios.get(
      '/api/secrets'
    )
  }

  /**
   * Get a list of global secrets
   * @param {string} namespace Namespace of the secrets
   */
  getGlobalSecrets (namespace) {
    Joi.assert(namespace, Joi.string().required(), 'Must specify namespace')

    return this._axios.get(
            `/api/secrets/${namespace}`
    )
  }

  /**
   * Get a global secret
   * @param {string} namespace Namespace of the secret
   * @param {string} name Name of the secret
   */
  getGlobalSecret (namespace, name) {
    Joi.assert(namespace, Joi.string().required(), 'Must specify namespace')
    Joi.assert(name, Joi.string().required(), 'Must specify name')

    return this._axios.get(
            `/api/secrets/${namespace}/${name}`
    )
  }

  /**
   * Delete a global secret
   * @param {string} namespace Namespace of the secret
   * @param {string} name Name of the secret
   */
  deleteGlobalSecret (namespace, name) {
    Joi.assert(namespace, Joi.string().required(), 'Must specify namespace')
    Joi.assert(name, Joi.string().required(), 'Must specify name')

    return this._axios.delete(
            `/api/secrets/${namespace}/${name}`
    )
  }

  /**
   * Update a global secret
   * @param {string} namespace Namespace of the secret
   * @param {string} name Name of the secret
   * @param {Secret} secret Secret to update
   */
  updateGlobalSecret (namespace, name, secret) {
    Joi.assert(namespace, Joi.string().required(), 'Must specify namespace')
    Joi.assert(name, Joi.string().required(), 'Must specify name')
    Joi.assert(secret, Secret, 'Specify valid secret')

    return this._axios.post(
            `/api/secrets/${namespace}/${name}`,
            secret
    )
  }

  /**
   * Create a global secret
   * @param {string} namespace Namespace of the secret
   * @param {Secret} secret Secret to create
   */
  createGlobalSecret (namespace, secret) {
    Joi.assert(namespace, Joi.string().required(), 'Must specify namespace')
    Joi.assert(secret, Secret, 'Specify valid secret')

    return this._axios.post(
            `/api/secrets/${namespace}`,
            secret
    )
  }

  /**
   * Get queue
   */
  getQueue () {
    return this._axios.get(
      '/api/queue'
    )
  }

  /**
   * Resume queue
   */
  resumeQueue () {
    return this._axios.post(
      '/api/queue'
    )
  }

  /**
   * Pause queue
   */
  pauseQueue () {
    return this._axios.delete(
      '/api/queue'
    )
  }

  /**
   * Get system statistics
   */
  getSystemStats () {
    return this._axios.get(
      '/api/system/stats'
    )
  }
}

const RetryBuild = Joi.object().pattern(
  /.*/,
  Joi.string()
)

const User = Joi.object({
  login: Joi.string(),
  email: Joi.string(),
  avatar: Joi.string(),
  machine: Joi.boolean(),
  admin: Joi.boolean(),
  active: Joi.boolean(),
  syncing: Joi.boolean(),
  synced: Joi.date().timestamp('unix'),
  created: Joi.date().timestamp('unix'),
  updated: Joi.date().timestamp('unix'),
  last_login: Joi.date().timestamp('unix')
})

const LatestBuild = Joi.object({
  ref: Joi.string(),
  branch: Joi.string()
})

const TriggerBuild = Joi.object({
  branch: Joi.string(),
  commit: Joi.string()
})

const RepoSettings = Joi.object({
  visibility: Joi.string(),
  config_path: Joi.string(),
  trusted: Joi.boolean(),
  protected: Joi.boolean(),
  ignore_forks: Joi.boolean(),
  ignore_pull_requests: Joi.boolean(),
  auto_cancel_pull_requests: Joi.boolean(),
  auto_cancel_pushes: Joi.boolean(),
  auto_cancel_running: Joi.boolean(),
  timeout: Joi.number(),
  throttle: Joi.number(),
  counter: Joi.number()
})

const Secret = Joi.object({
  name: Joi.string(),
  data: Joi.string(),
  pull_request: Joi.boolean(),
  pull_request_push: Joi.boolean()
})

const Cron = Joi.object({
  name: Joi.string(),
  branch: Joi.string(),
  expr: Joi.string(),
  target: Joi.string(),
  disabled: Joi.boolean()
})

const SelfRepos = Joi.object({
  latest: Joi.boolean()
})

const SyncRepos = Joi.object({
  async: Joi.boolean()
})

module.exports = {
  Client,
  RetryBuild,
  User,
  LatestBuild,
  TriggerBuild,
  RepoSettings,
  Secret,
  Cron,
  SelfRepos,
  SyncRepos
}
