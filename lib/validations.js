const Joi = require('@hapi/joi')

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
