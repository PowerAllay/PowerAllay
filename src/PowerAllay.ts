import { Config, types } from "./utils/Config";
import * as path from "path";
import { BaseLogger } from "./utils/BaseLogger";
import { Language } from "./languages/Language";

export const VersionInfo = {
    name: "PowerAllay",
    version: "1.0.0"
};

export class PowerAllay {
    private properties: Config;
    private language: Language;
    private readonly dataPath: string;
    private readonly baselogger: BaseLogger;

    /**
     * @constructor
     */
    constructor() {
        this.dataPath = path.join(__dirname, '..');
        this.baselogger = new BaseLogger(this);
        this.initProperties();
        this.initLanguage();
        this.getLogger().info(
            this.getLanguage().translate("running-info", VersionInfo.name, VersionInfo.version)
        );
    }

    /**
     * Initialize server properties
     *
     * @private
     */
    private initProperties() {
        this.getLogger().info('Loading server properties...');
        this.properties = new Config(`${this.getDataPath()}/server.json`, types.json, {
            'server-port': 19132,
            'motd': 'PowerAllay',
            'max-players': 20,
            'default-world': 'world',
            'language': 'en_US',
            'debug': false,
        })
    }

    /**
     * Initialize server language
     *
     * @private
     */
    private initLanguage() {
        this.language = new Language(this);
        this.getLogger().info(
            this.getLanguage().translate("selected-language", this.language.getLanguage(), this.language.getName())
        );
    }

    /**
     * Get server data path
     */
    getDataPath() {
        return this.dataPath;
    }

    /**
     * Get server properties
     */
    getProperties() {
        return this.properties;
    }

    /**
     * Get server logger
     */
    getLogger() {
        return this.baselogger;
    }

    /**
     * Get server language
     */
    getLanguage() {
        return this.language;
    }

    /**
     * Start server
     */
    stop() {
        this.getLogger().info('Stopping server...');
        process.exit(0);
    }
}
