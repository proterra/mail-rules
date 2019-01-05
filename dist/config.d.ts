export default class Config {
    static getConfig(): Config;
    private static config;
    private server;
    private userid;
    private password;
    constructor();
    getServer(): any;
    getUserid(): any;
    getPassword(): any;
}
