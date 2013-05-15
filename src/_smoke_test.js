(function() {
	"use strict";

	var child_process = require('child_process');
	var http = require('http');
	var child;

	exports.setUp = function(done) {
		runServer(done);
	};

	exports.tearDown = function(done) {
		child.on('exit', function(code, signal) {
			done();
		});
		child.kill();
	};

	exports.test_canGetHomepage = function(test) {
		httpGet("http://localhost:8080", function(response, receivedData) {
			var foundHomepage = receivedData.indexOf("Nick and Dani homepage") !== -1;
			test.ok(foundHomepage, "Should have contained Nick and Dani hompepage");
			test.done();
		});
	};

	exports.test_canGet404Page = function(test) {
		httpGet("http://localhost:8080/nonexistant.html", function(response, receivedData) {
			var foundHomepage = receivedData.indexOf("Page not found") !== -1;
			test.ok(foundHomepage, "Should have contained 404 content");
			test.done();
		});
	};

	function runServer(callback) {
		child = child_process.spawn("node", ["src/server/nickanddani", "8080"]);
		child.stdout.setEncoding("utf8");
		child.stdout.on("data", function(chunk) {
			if (chunk.trim() === "Server started") callback();
		});
	}

	function httpGet(url, callback) {
		var request = http.get(url);
		request.on('response', function(response) {
			var receivedData = "";
			response.setEncoding("utf8");

			response.on('data', function(chunk) {
				receivedData += chunk;
			});
			response.on('end', function() {
				callback(response, receivedData);
			});
		});
	}

}());