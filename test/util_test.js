/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

var sinon = require('sinon');
var grunt = require('grunt');
var util = require('../tasks/lib/util.js').init(grunt);

module.exports = {
  setUp: function (callback) {
    'use strict';
    this.origData = grunt.config.data;
    grunt.config.data = {
      testvalue: "test"
    };
    callback();
  },
  tearDown: function (callback) {
    'use strict';
    grunt.config.data = this.origData;
    callback();
  },
  parseConnectionOptions_password: function (test) {
    'use strict';
    var connectionOptions = {},
        options = {};

    options = {
      host: 'localhost',
      port: 22,
      username: 'andrewrjones',
      password: 'andrewrjones'
    };

    connectionOptions = util.parseConnectionOptions(options);

    test.equal(options.host, connectionOptions.host, 'host');
    test.equal(options.port, connectionOptions.port, 'port');
    test.equal(options.username, connectionOptions.username, 'username');
    test.equal(options.password, connectionOptions.password, 'password');
    test.ok(!connectionOptions.privateKey, 'no private key');
    test.ok(!connectionOptions.passphrase, 'no passphrase');
    test.ok(!connectionOptions.agent, 'no agent');

    test.done();
  },
  parseConnectionOptions_privateKey: function (test) {
    'use strict';
    var connectionOptions = {},
        options = {};

    options = {
      host: 'localhost',
      port: 22,
      username: 'andrewrjones',
      privateKey: '12345',
      passphrase: 'andrewrjones'
    };

    connectionOptions = util.parseConnectionOptions(options);

    test.equal(options.host, connectionOptions.host, 'host');
    test.equal(options.port, connectionOptions.port, 'port');
    test.equal(options.username, connectionOptions.username, 'username');
    test.equal(options.privateKey, connectionOptions.privateKey, 'privateKey');
    test.equal(options.passphrase, connectionOptions.passphrase, 'passphrase');
    test.ok(!connectionOptions.password, 'no password');
    test.ok(!connectionOptions.agent, 'no agent');

    test.done();
  },
  parseConnectionOptions_agent: function (test) {
    'use strict';
    var connectionOptions = {},
        options = {};

    options = {
      host: 'localhost',
      port: 22,
      username: 'andrewrjones',
      agent: 'foo'
    };

    connectionOptions = util.parseConnectionOptions(options);

    test.equal(options.host, connectionOptions.host, 'host');
    test.equal(options.port, connectionOptions.port, 'port');
    test.equal(options.username, connectionOptions.username, 'username');
    test.equal(options.agent, connectionOptions.agent, 'agent');
    test.ok(!connectionOptions.privateKey, 'no private key');
    test.ok(!connectionOptions.passphrase, 'no passphrase');
    test.ok(!connectionOptions.password, 'no password');

    test.done();
  },
  validateString: function (test) {
    'use strict';

    test.ok(!util.validateString("name"), "should not validate invalid string");
    test.ok(!util.validateString("name", false), "should not validate invalid string");
    test.ok(!util.validateString("name", 32), "should not validate invalid string");
    test.equal(util.validateString("name", "string"), "string", "should validate a valid string");
    test.equal(util.validateString("name", function () {
      return "hello";
    }), "hello", "should evaluate a function");
    test.ok(!util.validateString("name", function () {
      return 32;
    }), "should evaluate a function");
    test.done();
  },
  validateStringAndProcess: function (test) {
    'use strict';
    test.equal(util.validateStringAndProcess("name", "string"), "string", "simple string");
    // make sure grunt has the correct data set
    test.equal(util.validateStringAndProcess("name", "string <%= testvalue %>"), "string test", "string with template");
    test.done();
  },
  validateStringArrayAndProcess: function (test) {
    'use strict';
    test.ok(!util.validateStringArrayAndProcess("name", false), "should not validate invalid string array");
    test.deepEqual(util.validateStringArrayAndProcess("name", "string"), ["string"], "should convert single string into string array");
    test.deepEqual(util.validateStringArrayAndProcess("name", function () {
      return "string";
    }), ["string"], "should evaluate function");
    test.deepEqual(util.validateStringArrayAndProcess("name", ["string 1", "string 2"]), ["string 1", "string 2"], "simple string array");
    test.deepEqual(util.validateStringArrayAndProcess("name", function () {
      return ["string 1", "string 2"];
    }), ["string 1", "string 2"], "should evaluate function");
    test.ok(!util.validateStringArrayAndProcess("name", function () {}), "should evaluate function");
    test.deepEqual(util.validateStringArrayAndProcess("name", ["string 1 <%= testvalue %>", "string 2 <%= testvalue %>"]), ["string 1 test", "string 2 test"], "strings with templates");
    test.done();
  },
  validateNumber: function (test) {
    'use strict';
    test.ok(!util.validateNumber("name"), "should not validate invalid number");
    test.equal(util.validateNumber("name", 32), 32, "should validate number");
    test.equal(util.validateNumber("name", 0), 0, "should validate zero");
    test.done();
  }

};