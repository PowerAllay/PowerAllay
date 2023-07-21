import { Config, types } from "./utils/Config";
import * as path from "path";
import { BaseLogger } from "./utils/BaseLogger";
import {Language, languages} from "./languages/Language";

export class PowerAllay {
    private properties: Config;
    private language: Language;
    private readonly dataPath: string;
    private readonly baselogger: BaseLogger;

    constructor() {
        this.dataPath = path.join(__dirname, '..');
        this.baselogger = new BaseLogger(this);
        this.initProperties();
        this.initLanguage();
    }

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

    private initLanguage() {
        this.language = new Language(this);
        this.getLogger().info(
            this.getLanguage().translate("selected-language", this.language.getLanguage(), this.language.getName())
        );
    }

    getDataPath() {
        return this.dataPath;
    }

    getProperties() {
        return this.properties;
    }

    getLogger() {
        return this.baselogger;
    }

    getLanguage() {
        return this.language;
    }

    stop() {
        this.getLogger().info('Stopping server...');
        process.exit(0);
    }
}
