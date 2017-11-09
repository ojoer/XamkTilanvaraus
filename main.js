const http = require("http");

http.createServer(function (request, response) {

    response.writeHead(200, { 'Content-Type': 'text/plain' });


    response.end('asd\n');
}).listen(8000);

console.log('Palvelin käynnissä osoitteessa http://127.0.0.1:8000/');
