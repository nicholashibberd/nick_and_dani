(function() {

	"use strict";
	var http = require("http");
	var fs = require("fs");
	var server;
  var nodeStatic = require('node-static');
  var staticServer = new nodeStatic.Server('./src/server/content/static');

	exports.start = function(homepageToServe, notFoundPageToServe, portNumber, callback) {
		if (!portNumber) throw new Error("Require port number");
		server = http.createServer();

		server.on("request", function(request, response) {
			if (request.url === '/' || request.url === '/index.html' ) {
				serveFile(response, homepageToServe);
		  }
      else if (isStaticRequest) {
        console.log('###############' + request.url)
       var url = require('url');
       var pathname = decodeURI(url.parse(request.url).pathname);
        console.log(pathname);
       staticServer.serve(request, response);
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

  function isStaticRequest(request) {
    staticRequest = (request.url.match(/^\/(images|css)/));
    return staticRequest;
  }

	exports.stop = function(callback) {
		server.close(callback);
	};

}());
