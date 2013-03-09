var http = require("http");
var url = require('url');
var queryString = require('querystring');

function start(route) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname
		console.log("Request for " + pathname + " received");

		route(pathname);

		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("Hello World!!! \n");
		response.end();
	}
	var port = process.env.PORT || 5000;

	http.createServer(onRequest).listen(port);
	console.log('Server has started..')
}

exports.start = start;