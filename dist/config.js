"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    static getConfig() {
        if (!Config.config) {
            Config.config = new Config();
        }
        return Config.config;
    }
    constructor() {
        const jsonCfg = require('../config.json');
        this.server = jsonCfg.server;
        this.userid = jsonCfg.userid;
        this.password = jsonCfg.password;
    }
    getServer() {
        return this.server;
    }
    getUserid() {
        return this.userid;
    }
    getPassword() {
        return this.password;
    }
}
exports.default = Config;
