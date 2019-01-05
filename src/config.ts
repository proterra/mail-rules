export default class Config {

    public static getConfig() {
        if (!Config.config) {
            Config.config = new Config();
        }

        return Config.config;
    }

    private static config: Config;

    private server;
    private userid;
    private password;

    public constructor() {
        const jsonCfg = require('../config.json');
        this.server = jsonCfg.server;
        this.userid = jsonCfg.userid;
        this.password = jsonCfg.password;
    }

    public getServer() {
        return this.server;
    }

    public getUserid() {
        return this.userid;
    }

    public getPassword() {
        return this.password;
    }
}
