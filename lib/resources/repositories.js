const Joi = require('@hapi/joi')
const Querystring = require('querystring')
const {
  RepoSettings,
  SelfRepos
} = require('../validations')

class Repositories {
  /**
   * @constructor
   * @param {AxiosInstance} webClient webclient
   */
  constructor (webClient) {
    this._axios = webClient
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
}

module.exports = {
  Repositories
}
