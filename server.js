const http = require('http');
const url = require('url');

function iniciarServidor(router, handle){
    function onRequest(req,res){
        var pathname = url.parse(req.url).pathname;
		console.log("Request para ruta " + pathname + " recibido.");
        router(handle,pathname,res,req);
    }
    http.createServer(onRequest).listen(8888);
    console.log("Server iniciado!");
}

exports.iniciarServidor=iniciarServidor;
