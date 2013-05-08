"use strict";

(function() {

	var server = require("./server.js");
	var http = require('http');
	var fs = require('fs');
	var assert = require('assert');

	var TEST_FILE = "generated/test/test1.html";

	exports.tearDown = function(done) {
		if (fs.existsSync(TEST_FILE)) {
			fs.unlinkSync(TEST_FILE);
			assert.ok(!fs.existsSync(TEST_FILE), "file should have been deleted");
		}
		done();
	};

	exports.test_serverServesHomePageFile = function(test) {
		var testDir = "generated/test";
		var testData = "This is served from a file";

		fs.writeFileSync(TEST_FILE, testData);

		httpGet('http://localhost:8080', function(response, responseData) {
			test.equals(200, response.statusCode, "status code");
			test.equals(testData, responseData, "response text");
			test.done();
		});
	};


	exports.test_serverReturns404ForEverythingExceptHomepage = function(test) {
		var testDir = "generated/test";
		var testData = "This is served from a file";

		fs.writeFileSync(TEST_FILE, testData);
		httpGet('http://localhost:8080/bargle', function(response, responseData) {
			test.equals(404, response.statusCode, "status code");
			test.done();
		});
	};

	exports.test_serverAlsoReturnsHomePageWhenAskedForIndex = function(test) {
		var testDir = "generated/test";
		var testData = "This is served from a file";

		fs.writeFileSync(TEST_FILE, testData);

		httpGet('http://localhost:8080/index.html', function(response, responseData) {
			test.equals(200, response.statusCode, "status code");
			test.done();
		});
	};

	function httpGet(url, callback) {
		server.start(TEST_FILE, 8080);
		var request = http.get(url);
		request.on('response', function(response) {
			var receivedData = "";
			response.setEncoding("utf8");

			response.on('data', function(chunk) {
				receivedData += chunk;
			});
			response.on('end', function() {
				server.stop(function() {
					callback(response, receivedData);
				});
			});
		});
	}

	exports.test_serverRequiresFileToServe = function(test) {
		test.throws(function() {
			server.start();
		});
		test.done();
	};

	exports.test_serverRequiresPortNumber = function(test) {
		test.throws(function() {
			server.start(TEST_FILE);
		});
		test.done();
	};

	exports.test_ServerRunsCallBackWhenStopCompletes = function(test) {
		server.start(TEST_FILE, 8080);
		server.stop(function() {
			test.done();
		});
	};

	exports.test_stopCalledWhenServerIsntRunningThrowsException = function(test) {
		test.throws(function() {
			server.stop();
		});
		test.done();
	};
}());