(function() {
	"use strict";

	var child_process = require('child_process');
	var http = require('http');
	var child;
	var fs = require('fs');
	var procfile = require('procfile');

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
		httpGet("http://localhost:5000", function(response, receivedData) {
			var foundHomepage = receivedData.indexOf("Nick and Dani homepage") !== -1;
			test.ok(foundHomepage, "Should have contained Nick and Dani hompepage");
			test.done();
		});
	};

	exports.test_canGet404Page = function(test) {
		httpGet("http://localhost:5000/nonexistant.html", function(response, receivedData) {
			var foundHomepage = receivedData.indexOf("Page not found") !== -1;
			test.ok(foundHomepage, "Should have contained 404 content");
			test.done();
		});
	};

	function runServer(callback) {
		var commandLine = parseProcfile();
		child = child_process.spawn(commandLine.command, commandLine.options);
		child.stdout.setEncoding("utf8");
		child.stdout.on("data", function(chunk) {
			if (chunk.trim().indexOf("Server started") !== -1) callback();
		});
	}

	function parseProcfile() {
		var fileData = fs.readFileSync('Procfile', "utf8");
		var webCommand = procfile.parse(fileData).web;
		webCommand.options = webCommand.options.map(function(element) {
			if (element === "$PORT") return "5000";
			else return element;
		});
		return webCommand;
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