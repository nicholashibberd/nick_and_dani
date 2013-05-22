basePath = '';
files = [
  MOCHA,
  MOCHA_ADAPTER,
  "node_modules/expect.js/expect.js",
  "src/client/_*_test.js"
];
exclude = [];
reporters = ['progress'];
port = 9876;
runnerPort = 9100;
colors = true;
autoWatch = false;
browsers = [];
captureTimeout = 60000;
singleRun = false;
