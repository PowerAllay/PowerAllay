import { Config, types } from './utils/Config';
import * as path from 'path';
import { BaseLogger } from './utils/BaseLogger';
import { Language } from './languages/Language';
import { createServer, Version } from "bedrock-protocol";

export const VersionInfo = {
    name: 'PowerAllay',
    version: '1.0.0',
    minecraftVersion: '1.20.10'
};

export class PowerAllay {
    private properties: Config;
    private language: Language;
    private readonly dataPath: string;
    private readonly baselogger: BaseLogger;
    private main: any;

    /**
     * @constructor
     */
    constructor() {
        this.dataPath = path.join(__dirname, '..');
        this.baselogger = new BaseLogger(this);
        this.initProperties();
        this.initLanguage();
        this.start().then();
    }

    /**
     * Initialize server properties
     *
     * @private
     */
    private initProperties() {
        this.getLogger().info('Loading server properties...');
        this.properties = new Config(
            `${this.getDataPath()}/server.json`,
            types.json,
            {
                'server-port': 19132,
                motd: 'PowerAllay',
                'max-players': 20,
                'default-world': 'world',
                language: 'en_US',
                debug: false
            }
        );
    }

    /**
     * Initialize server language
     *
     * @private
     */
    private initLanguage() {
        this.language = new Language(this);
        this.getLogger().info(
            this.getLanguage().translate(
                'selected-language',
                this.language.getLanguage(),
                this.language.getName()
            )
        );
    }

    async start() {
        this.getLogger().info(
            this.getLanguage().translate(
                'running-info',
                VersionInfo.name,
                VersionInfo.version
            )
        );
        this.main = createServer({
            host: "127.0.0.1",
            port: this.getProperties().get('server-port'),
            motd: {
                levelName: this.getProperties().get('default-world'),
                motd: this.getProperties().get('motd'),
            },
            maxPlayers: this.getProperties().get('max-players') || 20,
            offline: false,
            version: VersionInfo.minecraftVersion as Version
        })
        this.getLogger().info(
            this.getLanguage().translate("minecraft-running-version", VersionInfo.minecraftVersion)
        )
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
        this.main.close('Server closed!');
        process.exit(0);
    }
}
