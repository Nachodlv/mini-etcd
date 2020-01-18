class Requester {


    constructor(provider, local) {
        this.request = require('request');
        this.provider = provider;
        this.REQUEST_TIMEOUT = 1000;
        this.local = local;
        setInterval(() => this.healthCheck(), this.REQUEST_TIMEOUT);
    }

    healthCheck() {
        const instances = this.provider.instances.slice();
        instances.forEach(instance => {
            const ips = this.provider.instances.filter(currentIp => currentIp.id !== instance.id).map(currentIp =>
                currentIp.ip );
            this.request.post({
                url: instance.ip + "/ips",
                json: {ips: ips},
                agentOptions: {
                    rejectUnauthorized: false
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }, (error, httpResponse, _) => {
                if (!httpResponse || httpResponse.statusCode !== 200) {
                    this.provider.removeIp(instance.id);
                    console.log("The ip " + instance.ip + " was removed");
                    console.log(error)
                } else {
                    console.log(instance.ip + ' still alive')
                }
            })
        })
    }
}

module.exports = Requester;
