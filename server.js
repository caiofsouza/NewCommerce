var http = require("http"),
	request = require('request'),
	url = require("url"),
	path = require("path"),
	fs = require("fs")
	port = process.argv[2] || 8888;

http.createServer(function(request, response) {
	var contentType;

	if(request.url.indexOf('.html') != -1){
		contentType = 'text/html';
	}

	if(request.url.indexOf('.js') != -1){
		contentType = 'text/javascript';
	}

	if(request.url.indexOf('.css') != -1){
		contentType = 'text/css';
	}


	var uri = url.parse(request.url).pathname,
    filename = path.join(process.cwd(), uri);

	fs.exists(filename, function(exists) {

		if(!exists) {
			fs.readFile('public/index.html', "binary", function(err, file) {
				if(err) {        
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(err + "\n");
					response.end();
					return;
				}

				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write(file);
				response.end();
			});
		}

		if (fs.statSync(filename).isDirectory()) filename += 'public/index.html';


		fs.readFile(filename, "binary", function(err, file) {
			if(err) {        
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				return;
			}

			response.writeHead(200, {'Content-Type': contentType});
			response.write(file);
			response.end();
		});

	});


}).listen(8000);