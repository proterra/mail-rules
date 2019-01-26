import * as env from 'env-var';
import * as fs from 'fs';
import * as path from 'path';

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

    /**
     * Getter $cloudantUrl
     * @return {string}
     */
    public get $cloudantUrl(): string {
        return this.cloudantUrl;
    }

    /**
     * Setter $cloudantUrl
     * @param {string} value
     */
    public set $cloudantUrl(value: string) {
        this.cloudantUrl = value;
    }
    private rulesFile;
    private rules: object;

    private cloudantUrl: string;

    /**
     * Getter $todoistToken
     * @return {string}
     */
    public get $todoistToken(): string {
        return this.todoistToken;
    }

    /**
     * Setter $todoistToken
     * @param {string} value
     */
    public set $todoistToken(value: string) {
        this.todoistToken = value;
    }
    private todoistToken: string;

    /**
     * Getter $port
     * @return {number}
     */
    public get $port(): number {
        return this.port;
    }

    /**
     * Setter $port
     * @param {number} value
     */
    public set $port(value: number) {
        this.port = value;
    }
    private port: number;

    public constructor() {

        this.server = env.get('MR_SERVER').required().asString();
        this.userid = env.get('MR_USERID').required().asString();
        this.password = env.get('MR_PASSWORD').required().asString();
        this.rulesFile = path.resolve(env.get('MR_RULES_FILE').required().asString());
        this.port = env.get('MR_PORT').required().asIntPositive();

        if (!fs.existsSync(this.rulesFile)) {
            throw new Error(`Rules file ${this.rulesFile} does not exist`);
        } else {
            const fileContents = fs.readFileSync(this.rulesFile, 'utf8');
            this.rules = JSON.parse(fileContents);
        }
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

    public getRulesJson() {
        return this.rules;
    }

    public setRulesJsonString(rules: string) {
        // parse the string to make sure it is validjson
        // should also validated as well
        // TODO Need schema
        this.rules = JSON.parse(rules);
        fs.writeFileSync(this.rulesFile, JSON.stringify(this.rules), 'utf8');
    }
}
