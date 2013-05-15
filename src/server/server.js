(function() {

	"use strict";
	var http = require("http");
	var fs = require("fs");
	var server;

	exports.start = function(homepageToServe, notFoundPageToServe, portNumber, callback) {
		if (!portNumber) throw new Error("Require port number");
		server = http.createServer();

		server.on("request", function(request, response) {
			if (request.url === '/' || request.url === '/index.html' ) {
				serveFile(response, homepageToServe);
			}
			else {
				response.statusCode = 404;
				serveFile(response, notFoundPageToServe);
			}
		});
		server.listen(portNumber, callback);
	};

	function serveFile(response, file) {
		fs.readFile(file, function(err, data) {
			if (err) throw err;
			response.end(data);
		});
	}

	exports.stop = function(callback) {
		server.close(callback);
	};

}());