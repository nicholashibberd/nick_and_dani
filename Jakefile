/*global desc, task, jake, fail, complete, directory */

(function() {
	"use strict";

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
	task("lint", ["nodeVersion"], function() {
		var lint = require('./build/lint/lint_runner.js');

		var javascriptFiles = new jake.FileList();
		javascriptFiles.include("**/*.js");
		javascriptFiles.include("Jakefile");
		javascriptFiles.exclude("node_modules");
		javascriptFiles.exclude("build");
		var passed = lint.validateFileList(javascriptFiles.toArray(), nodeLintOptions(), {});
		if (!passed) fail("Lint failed!");
	});

	desc("Test everything");
	task("test", ["nodeVersion", TEMP_TESTFILE_DIR], function() {
		var testFiles = new jake.FileList();
		testFiles.include("**/_*_test.js");
		testFiles.exclude("node_modules");

		var reporter = require("nodeunit").reporters["default"];
		reporter.run(testFiles.toArray(), null, function(failures) {
			if (failures) fail("Tests failed");
			complete();
		});
	}, {async: true});

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


	function sh(command, callback) {
		console.log("> " + command);

		var stdout = "";
		var process = jake.createExec(command, {printStdout: true, printStderr: true});
		process.on("stdout", function(chunk) {
			console.log('stdout');
			stdout += chunk;
		});
		process.on("cmdEnd", function() {
			console.log('cmdout');
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


	function nodeLintOptions() {
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
			trailing: true,
			node: true
		};
	}
}());