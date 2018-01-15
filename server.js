const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
    console.log(req.url);
    // res.end('Hello Node.js');
});

server.listen(port, (err) => {
    if (err) {
        return console.log('Something went wrong: ' + err);
    }

    console.log('Server is up and running at: http://localhost:'+ port);
});