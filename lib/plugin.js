var input;

// plugins may receive input in JSON format as command
// line args immediately following a double dash.
process.argv.forEach(function (val, index, array) {
  if (val === "--") {
    input = process.argv[index+1];
  }
});

// alternatively plugin may receive input in JSON format
// from stdin. This is primarily for local testing.
if (!input) {
  process.stdin.resume();
  input = require('fs').readSync(process.stdin.fd, 10000, 0, "utf8")[0];
  process.stdin.pause();
}

module.exports = {
  params: JSON.parse(input),
};