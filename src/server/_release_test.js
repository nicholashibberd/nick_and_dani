(function() {
	"use strict";

	var child_process = require('child_process');
	var http = require('http');
	var child;
	var fs = require('fs');
	var procfile = require('procfile');

	exports.test_isOnWeb = function(test) {
		httpGet("http://www.danielleandnick.co.uk", function(response, receivedData) {
			var foundHomepage = receivedData.indexOf("Nick and Dani homepage") !== -1;
			test.ok(foundHomepage, "Should have contained Nick and Dani hompepage");
			test.done();
		});
	};

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