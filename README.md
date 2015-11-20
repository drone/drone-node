# drone-node
Node client for the Drone API

## Client

An API client is included in this package

```js
const Drone = require('drone-node');

const client = new Drone.Client({ server: 'https://your.drone.server.com', token: 'SoMeToKeN' });

client.getRepos().then((repos) => {

  // lists all the repos available to the authenticated user
});
```

Many methods are available, until they're documented see [lib/index.js](lib/index.js) for details.

## Plugins

This package provides utilities for creating [plugins](http://readme.drone.io/plugin/). Plugins are command-line programs invoked during the build process. Build information and plugin configuration is passed to the plugin as a command-line argument in JSON format:

```sh
node run super_plugin.js -- '{ "build": {"number": 1, "status": "success"} }'
```

Example usage:

```js
const Drone = require('drone-node');
const plugin = new Drone.Plugin();

plugin.parse().then((params) => {

  // gets build and repository information for
  // the current running build
  const build = params.build;
  const repo  = params.repo;

  // gets plugin-specific parameters defined in
  // the .drone.yml file
  const vargs = params.vargs;
});
```
