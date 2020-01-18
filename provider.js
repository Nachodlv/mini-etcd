class Provider{

    constructor() {
        // this.InstanceIp = require('./instance_ip.js');
        this.instances = []; // array of strings
        this.id = 1;
        this.nextIndex = 0; // for round robin
    }

    addNewIp(newIp) {
        this.instances.push({ip: newIp, id: this.id});
        this.id++;
        return this.id-1;
    }

    getId(ip) {
        const instances = this.instances.filter(i => i.ip === ip);
        return instances[0].id;
    }

    removeIp(id) {
        this.instances = this.instances.filter(instance => id !== instance.id)
    }

    getNextIp() {
        if(this.instances.length === 0) return null;

        this.nextIndex ++;
        if(this.nextIndex > this.instances.length) this.nextIndex = 1;

        return this.instances[this.nextIndex-1]

    }

}

module.exports = Provider;
