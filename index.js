const port = 1234;
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.json());

const local = process.argv[2] === 'local';

if(local) {
    const server = https.createServer({
        key: fs.readFileSync('./certificates/key.pem'),
        cert: fs.readFileSync('./certificates/cert.pem'),
        passphrase: 'mini-etcd'
    }, app);
    server.listen(port, function() {
        console.log("listening securely on port: " + port)
    });
} else {
    const server = http.Server(app);
    server.listen(port, function () {
        console.log("listening on: " + port);
    });
}


const provider = new (require('./provider.js'))();
new (require('./controller.js'))(app, provider, __dirname);
new (require('./requester.js'))(provider, local);
