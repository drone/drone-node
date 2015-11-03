# drone-node
Node client for the Drone API

## Plugins

This package provides utilities for creating [plugins](http://readme.drone.io/plugin/). Plugins are command-line programs invoked during the build process. Build information and plugin configuration is passed to the plugin as a command-line argument in JSON format:

```sh
node run super_plugin.js -- '{ "build": {"number": 1, "status": "success"} }'
```

Example usage:

```js
import {plugin} from "drone";

// gets build and repository information for
// the current running build
var build = plugin.params.build;
var repo  = plugin.params.repo;

// gets plugin-specific parameters defined in
// the .drone.yml file
var vargs = plugin.params.vargs;
```
