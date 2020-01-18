class Controller {
    constructor(app, provider, dirname){
        this.app = app;
        this.provider = provider;
        this.cors = require('cors');
        this.dirname = dirname;
        app.options('*', this.cors());

        this.addRoutes();
    }

    addRoutes() {
        this.registerIp();
        this.getIp();
        this.getIndex();
        this.getId();
    }

    /**
     * Body should be the ip
     *
     * Returns the id of the instance
     * */
    registerIp() {
        this.app.post('/ip', (req, res) => {
            const ip = this.getIpFromBody(req);
            const id = this.provider.addNewIp(ip);
            console.log("New ip found: " + ip );
            res.status(200);
            res.send(JSON.stringify(id))
        })
    }

    /**
     * Returns an ip of the running instances with the id
     * {
     *     id: number,
     *     ip: string
     * }
     * */
    getIp() {
        this.app.get('/ip', this.cors(), (req, res) => {
            const ip = this.provider.getNextIp();

            if(ip !== null) {
                res.status(200);
                res.send(ip);
            } else {
                res.status(404);
                res.send("No ips available")
            }
        })
    }

    getId() {
        this.app.get('/id', this.cors(), (req, res) => {
            const ip = this.getIpFromBody(req);
            const id = this.provider.getId(ip);

            if(ip !== null) {
                res.status(200);
                res.send(id);
            } else {
                res.status(404);
                res.send("No ip available")
            }
        })
    }

    getIndex() {
        this.app.get('/', this.cors(), (req, res) => {
            res.sendFile(this.dirname + '/index.html');
        })
    }


    getIpFromBody (req) {
        const port = req.body? req.body.port : '';
        const headerIp = (req.headers && req.headers['x-forwarded-for'])
            || req.ip
            || req._remoteAddress
            || (req.connection && req.connection.remoteAddress);
        const ipSpliced= headerIp.split('::ffff:');
        let ip = ipSpliced[0];
        if(ipSpliced.length > 1){
            ip = ipSpliced[1];
        }
        return "https://" + ip + (port? ":" + port : "");
    }

}

module.exports = Controller;
