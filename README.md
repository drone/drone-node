# drone-node

[![Build Status](http://cloud.drone.io/api/badges/drone/drone-node/status.svg)](http://cloud.drone.io/drone/drone-node)
[![Gitter chat](https://badges.gitter.im/drone/drone.png)](https://gitter.im/drone/drone)
[![Join the discussion at https://discourse.drone.io](https://img.shields.io/badge/discourse-forum-orange.svg)](https://discourse.drone.io)
[![Drone questions at https://stackoverflow.com](https://img.shields.io/badge/drone-stackoverflow-orange.svg)](https://stackoverflow.com/questions/tagged/drone.io)
[![npm version](https://badge.fury.io/js/drone-node.svg)](https://badge.fury.io/js/drone-node)

Node client for the Drone API

## Example

```js
const drone = require('drone-node')

const client = new drone.Client({
  url: 'https://drone.example.com',
  token: 'SoMeToKeN'
})

client.getRepos().then((res) => {
  console.log(res)
}).catch((reason) => {
  console.error(reason)
})
```

Many functions are available, please read the source and jsdoc comments at [lib/index.js](./lib/index.js).

## Contributing

Fork -> Patch -> Lint -> Test -> Push -> Pull Request

### Integration Tests

These tests are dependent on a running drone server. You can run them with the following command:
```
DRONE_SERVER=your_server DRONE_TOKEN=your_token yarn run integration
```

### Unit Tests

These will be run automatically with your PR. Ensure they pass before creating a PR.

```
yarn run test
```

## Authors

* [Thomas Boerger](https://github.com/tboerger)
* [Other contributors](https://github.com/drone/drone-node/graphs/contributors)

## License

Apache-2.0

## Copyright

```
Copyright (c) 2020 Drone.io Developers
```
