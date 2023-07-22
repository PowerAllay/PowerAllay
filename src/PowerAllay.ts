import { Config } from './utils/Config';
import * as path from 'path';
import { BaseLogger } from './utils/BaseLogger';
import { Language } from './languages/Language';
import { createServer, Version, Player } from 'bedrock-protocol';
import { Client } from './player/Client';
import { ResourcePacksInfoPacket } from './network/packets/ResourcePacksInfoPacket';
import { ProtocolInfo } from './network/packets/ProtocolInfo';
import { EventEmitter } from 'node:events';
import { PlayerLoginEvent } from './events/player/PlayerLoginEvent';
import { Events } from './events/AllayEvent';

export const VersionInfo = {
    name: 'PowerAllay',
    version: '1.0.0'
};

export class PowerAllay {
    private properties: Config;
    private language: Language;
    private readonly dataPath: string;
    private readonly baselogger: BaseLogger;
    private main: any;
    private readonly players: Client[] = [];
    private events: EventEmitter;

    /**
     * @constructor
     */
    constructor() {
        this.dataPath = path.join(__dirname, '..');
        this.baselogger = new BaseLogger(this);
        this.events = new EventEmitter();
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
            Config.JSON,
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
            host: '127.0.0.1',
            port: this.getProperties().get('server-port'),
            motd: {
                levelName: this.getProperties().get('default-world'),
                motd: this.getProperties().get('motd')
            },
            maxPlayers: this.getProperties().get('max-players') || 20,
            offline: false,
            version: ProtocolInfo.MINECRAFT_VERSION as Version
        });
        this.getLogger().info(
            this.getLanguage().translate(
                'minecraft-running-version',
                ProtocolInfo.MINECRAFT_VERSION
            )
        );
        this.main.on('connect', (client: Player) => {
            client.on('login', () => {
                const player = new Client(client);
                this.getLogger().info(
                    this.getLanguage().translate(
                        'player-login',
                        client.profile.name
                    )
                );
                this.events.emit(
                    Events.PLAYER_LOGIN_EVENT,
                    new PlayerLoginEvent(player)
                );
                if (client.version < ProtocolInfo.CURRENT_PROTOCOL) {
                    client.disconnect('Outdated client!');
                    this.getLogger().info(
                        this.getLanguage().translate(
                            'outdated-client',
                            client.profile.name
                        )
                    );
                } else if (client.version > ProtocolInfo.CURRENT_PROTOCOL) {
                    client.disconnect('Outdated server!');
                    this.getLogger().info(
                        this.getLanguage().translate(
                            'outdated-server',
                            client.profile.name
                        )
                    );
                }
            });
            client.on('join', () => {
                const player = new Client(client);
                this.players.push(player);
                player.sendDataPacket(new ResourcePacksInfoPacket());
            });
            client.on('close', () => {
                const player = new Client(client);
                this.getLogger().info(
                    this.getLanguage().translate(
                        'player-logout',
                        client.profile.name
                    )
                );
                this.players.splice(this.players.indexOf(player), 1);
            });
        });
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
     * Handle server events
     *
     * @param event
     * @param callback
     */
    on(event: string, callback: any) {
        this.events.on(event, callback);
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
