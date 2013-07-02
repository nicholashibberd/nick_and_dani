/*global desc, task, jake, fail, complete, directory */

(function() {
	"use strict";

	var lint = require('./build/lint/lint_runner.js');
	var nodeUnit = require("nodeunit").reporters["default"];
	var NODE_VERSION = "v0.8.23";
	var GENERATED_DIR = "generated";
	var TEMP_TESTFILE_DIR = GENERATED_DIR + "/test";

	directory(TEMP_TESTFILE_DIR);

	desc("Delete all generated file");
	task("clean", [], function() {
		jake.rmRf(GENERATED_DIR);
	});

	desc("Build and test");
	task("default", ["lint", "test"]);

	desc("Lint everything");
	task("lint", ["lintNode", "lintClient"]);

	task("lintNode", ["nodeVersion"], function() {
		var passed = lint.validateFileList(nodeFiles(), nodeLintOptions(), {});
		if (!passed) fail("Lint failed!");
	});

	task("lintClient", function() {
		var passed = lint.validateFileList(clientFiles(), browserLintOptions(), {});
		if (!passed) fail("Lint failed!");
	});

	desc("Test everything");
	task("test", ["testNode", "testClient"]);

	desc("Test server code");
	task("testNode", ["nodeVersion", TEMP_TESTFILE_DIR], function() {
		nodeUnit.run(nodeTestFiles(), null, function(failures) {
			if (failures) fail("Tests failed");
			complete();
		});
	}, {async: true});

	desc("Test live site");
	task("testLiveSite", [], function() {
		var testFiles = new jake.FileList();
		testFiles.include("src/server/_release_test.js");

		var reporter = require("nodeunit").reporters["default"];
		reporter.run(testFiles.toArray(), null, function(failures) {
			if (failures) fail("Tests failed");
			complete();
		});
	}, {async: true});

	desc("Test client code");
	task("testClient", function() {
		sh("node node_modules/.bin/karma run", "Client tests failed", function(output) {
			// var SUPPORTED_BROWSERS = ["Chrome 27.0 (Mac)", "Safari 5.1 (Mac)"];
			var SUPPORTED_BROWSERS = ["Chrome 27.0 (Mac)"];
			console.log(output);
			SUPPORTED_BROWSERS.forEach(function(browser) {
				assertBrowserIsTested(browser, output);
			});
		});
	}, {async: true});

	function assertBrowserIsTested(browserName, output) {
		var searchString = browserName + ": Executed";
		var found = output.indexOf(searchString) !== -1;
		if (!found) fail(browserName + " was not tested");
		else console.log("Confirmed: " + browserName);
	}

	desc("Integrate");
	task("integrate", ["default"], function() {
		console.log('Integration logic goes here');
	});


	// desc("Ensure correct version of node");
	task("nodeVersion", [], function() {
		function failWithQualifier(qualifier) {
			fail("Incorrect node version. Expected " + qualifier +
				" [" + expectedString + "], but was [" +  actualString + "].");
		}

		var expectedString = NODE_VERSION;
		var actualString = process.version;
		var expected = parseNodeVersion("expected Node version", expectedString);
		var actual = parseNodeVersion("Node version", actualString);

		if (process.env.strict) {
			if (actual[0] !== expected[0] || actual[1] !== expected[1] || actual[2] !== expected[2]) {
				failWithQualifier("exactly");
			}
		}
		else {
			if (actual[0] < expected[0]) failWithQualifier("at least");
			if (actual[0] === expected[0] && actual[1] < expected[1]) failWithQualifier("at least");
			if (actual[0] === expected[0] && actual[1] === expected[1] && actual[2] === expected[2]) failWithQualifier("at least");
		}

	});


	function sh(command, errorMessage, callback) {
		console.log("> " + command);

		var stdout = "";
		var process = jake.createExec(command, {printStdout: true, printStderr: true});
		process.on("stdout", function(chunk) {
			stdout += chunk;
		});
		process.on("error", function(chunk) {
			fail(errorMessage);
		});
		process.on("cmdEnd", function() {
			callback(stdout);
		});
		process.run();
	}

	function parseNodeVersion(description, versionString) {
		var versionMatcher = /^v(\d+)\.(\d+)\.(\d+)$/; // v[major].[minor].[bugfix]
		var versionInfo = versionString.match(versionMatcher);
		if (versionInfo === null) fail("Could not parse " + description + " (was '" + versionString + "')");

		var major = parseInt(versionInfo[1], 10);
		var minor = parseInt(versionInfo[2], 10);
		var bugfix = parseInt(versionInfo[3], 10);
		return [major, minor, bugfix];
	}

	function nodeFiles() {
		var javascriptFiles = new jake.FileList();
		javascriptFiles.include("**/*.js");
		javascriptFiles.include("Jakefile");
		javascriptFiles.exclude("node_modules");
		javascriptFiles.exclude("build");
		javascriptFiles.exclude("karma.conf.js");
		javascriptFiles.exclude("src/client");
		return javascriptFiles.toArray();
	}

	function nodeTestFiles() {
		var testFiles = new jake.FileList();
		testFiles.include("**/_*_test.js");
		testFiles.exclude("node_modules");
		testFiles.exclude("src/client/**");
		testFiles.exclude("src/server/_release_test.js");
		return testFiles.toArray();
	}

	function clientFiles() {
		var javascriptFiles = new jake.FileList();
		javascriptFiles.include("src/client/**/*.js");
		return javascriptFiles.toArray();
	}

	function globalLintOptions() {
		return {
			bitwise: true,
			curly: false,
			eqeqeq: true,
			forin: true,
			immed: true,
			latedef: true,
			newcap: true,
			noarg: true,
			noempty: true,
			nonew: true,
			regexp: true,
			undef: true,
			strict: true,
			trailing: true
		};
	}

	function nodeLintOptions() {
		var options = globalLintOptions();
		options.node = true;
		return options;
	}

	function browserLintOptions() {
		var options = globalLintOptions();
		options.browser = true;
		return options;
	}
}());
