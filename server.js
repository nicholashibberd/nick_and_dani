"use strict";
var http = require("http");
var url = require('url');
var fs = require('fs');
var queryString = require('querystring');

function start(route) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received");

		route(pathname);

		fs.readFile('app/views/index.html', function(err, page) {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(page);
			response.end();
		});
	}
	var port = process.env.PORT || 5000;

	http.createServer(onRequest).listen(port);
	console.log('Server has started..');
}

exports.start = start;