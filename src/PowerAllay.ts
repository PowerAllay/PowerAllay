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
import { ClientManager } from './player/ClientManager';
import { ClientInfo } from './player/ClientInfo';
import { ResourcePackResponsePacket } from './network/packets/ResourcePackResponsePacket';
import { ResourcePackStackPacket } from './network/packets/ResourcePackStackPacket';
import { StartGamePacket } from './network/packets/StartGamePacket';
import { Dimension } from './world/dimension/Dimension';
import { Generator } from './world/generator/Generator';
import { PlayerMovementSettings } from './network/packets/types/PlayerMovementSettings';
import { BiomeDefinitionListPacket } from './network/packets/BiomeDefinitionListPacket';
import {
    biome_definition_list,
    available_entity_identifiers,
    creative_content,
    update_attributes
} from '@powerallay/bedrock-data';
import { AvailableEntityPacket } from './network/packets/AvailableEntityPacket';
import { CreativeContentPacket } from './network/packets/CreativeContentPacket';
import { SetCommandsEnablePacket } from './network/packets/SetCommandsEnablePacket';
import { UpdateAttributesPacket } from './network/packets/UpdateAttributesPacket';
import { ItemComponentPacket } from './network/packets/ItemComponentPacket';
import { NetworkChunkPublisherUpdatePacket } from './network/packets/NetworkChunkPublisherUpdatePacket';
import { Vector3 } from './math/Vector3';
import { ClientCacheStatusPacket } from './network/packets/ClientCacheStatusPacket';
import { World } from './world/World';
import { LevelChunkPacket } from './network/packets/LevelChunkPacket';
import { ChunkPosition } from './network/packets/types/ChunkPosition';
import { PlayStatusPacket } from './network/packets/PlayStatusPacket';
import { PlayerQuitEvent } from './events/player/PlayerQuitEvent';
import { WorldManager } from './world/WorldManager';
import * as fs from 'fs';

export const VersionInfo = {
    name: 'PowerAllay',
    version: '1.0.0'
};

export class PowerAllay {
    private properties: Config;
    private language: Language;
    private readonly dataPath: string;
    private readonly baseLogger: BaseLogger;
    private readonly clientManager: ClientManager;
    private readonly worldManager: WorldManager;
    private main: any;
    private readonly players: Client[] = [];
    private events: EventEmitter;
    private readonly DEFAULT_VIEW_DISTANCE = 16;

    /**
     * @constructor
     */
    constructor() {
        this.dataPath = path.join(__dirname, '..');
        this.baseLogger = new BaseLogger(this);
        this.clientManager = new ClientManager(this);
        this.events = new EventEmitter();
        this.worldManager = new WorldManager(this, path.join(this.getDataPath(), 'worlds'));
        this.initProperties();
        this.initLanguage();
        for (const file of [path.join(this.getDataPath(), 'players'), path.join(this.getDataPath(), 'worlds')]) {
            if (!fs.existsSync(file)) {
                fs.mkdirSync(file);
            }
        }
        this.start().then();
    }

    /**
     * Initialize server properties
     *
     * @private
     */
    private initProperties() {
        this.getLogger().info('Loading server properties...');
        this.properties = new Config(`${this.getDataPath()}/server.json`, Config.JSON, {
            'server-port': 19132,
            motd: 'PowerAllay',
            'max-players': 20,
            'default-world': 'world',
            difficulty: 2,
            'default-gamemode': 0,
            'view-distance': this.DEFAULT_VIEW_DISTANCE,
            language: 'en_US',
            debug: false
        });
    }

    /**
     * Initialize server language
     *
     * @private
     */
    private initLanguage() {
        this.language = new Language(this);
        this.getLogger().info(
            this.getLanguage().translate('selected-language', this.language.getLanguage(), this.language.getName())
        );
    }

    async start() {
        this.getLogger().info(this.getLanguage().translate('running-info', VersionInfo.name, VersionInfo.version));
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
            this.getLanguage().translate('minecraft-running-version', ProtocolInfo.MINECRAFT_VERSION)
        );
        this.main.on('connect', (client: Player) => {
            client.on('login', () => {
                this.getLogger().info(this.getLanguage().translate('player-login', client.profile.name));
                this.events.emit(
                    Events.PLAYER_LOGIN_EVENT,
                    new PlayerLoginEvent(new ClientInfo(client.profile.xuid, client.profile.name))
                );
                if (client.version < ProtocolInfo.CURRENT_PROTOCOL) {
                    client.disconnect('Outdated client!');
                    this.getLogger().info(this.getLanguage().translate('outdated-client', client.profile.name));
                } else if (client.version > ProtocolInfo.CURRENT_PROTOCOL) {
                    client.disconnect('Outdated server!');
                    this.getLogger().info(this.getLanguage().translate('outdated-server', client.profile.name));
                }
            });
            client.on('join', () => {
                const player = this.clientManager.getPlayer(client);
                this.players.push(player);
                player.sendDataPacket(new ResourcePacksInfoPacket());
            });
            client.on('close', () => {
                const player = this.clientManager.getPlayer(client);
                this.getLogger().info(this.getLanguage().translate('player-logout', client.profile.name));
                this.events.emit(Events.PLAYER_QUIT_EVENT, new PlayerQuitEvent(player));
                this.players.splice(this.players.indexOf(player), 1);
            });
            client.on('spawn', () => {});
            client.on('packet', (packet) => {
                const player = this.clientManager.getPlayer(client);
                // @ts-ignore
                switch (packet.data.name) {
                    case 'resource_pack_client_response':
                        // @ts-ignore
                        switch (packet.data.params.response_status) {
                            case ResourcePackResponsePacket.HAVE_ALL_PACK:
                                player.sendDataPacket(new ResourcePackStackPacket());
                                break;
                            case ResourcePackResponsePacket.COMPLETED:
                                const world = player.getWorld();

                                this.getLogger().debug('Preparing StartGamePacket');
                                // eslint-disable-next-line no-case-declarations
                                const startGamePacket: StartGamePacket = new StartGamePacket();
                                startGamePacket.entityUniqueId = player.getId();
                                startGamePacket.entityRuntimeId = player.getId();
                                startGamePacket.playerGamemode = player.getGamemode();
                                startGamePacket.playerPosition = {
                                    x: 0,
                                    y: 0,
                                    z: 0
                                };
                                startGamePacket.rotation = {
                                    x: 0,
                                    z: 0
                                };
                                startGamePacket.seed = 0;
                                startGamePacket.biomeType = 0;
                                startGamePacket.biomeName = 'Plains'; //TODO: Add more biomes
                                startGamePacket.dimension = Dimension.OVERWORLD;
                                startGamePacket.generator = Generator.FLAT; //TODO: Add default generator to config
                                startGamePacket.worldGamemode = player.getGamemode();
                                startGamePacket.difficulty = this.getProperties().get('difficulty');
                                startGamePacket.spawnPosition = world.getSpawnPosition().asVector3().toJSON();
                                startGamePacket.AchievementsDisabled = true;
                                startGamePacket.gameRules = []; //TODO: Add game rules
                                startGamePacket.itemStates = []; //TODO: Add item states
                                startGamePacket.experiments = [];
                                startGamePacket.experimentsPreviouslyUsed = false;
                                startGamePacket.permissionLevel = player.getPermissionLevel();
                                startGamePacket.worldName = this.getProperties().get('default-world');
                                startGamePacket.playerMovementSettings = new PlayerMovementSettings(
                                    PlayerMovementSettings.SERVER,
                                    0,
                                    false
                                );
                                player.sendDataPacket(startGamePacket);
                                this.getLogger().debug('Sending entity definitions');
                                // eslint-disable-next-line no-case-declarations
                                const availableEntityIdentifiers = new AvailableEntityPacket();
                                availableEntityIdentifiers.nbt = available_entity_identifiers;
                                player.sendDataPacket(availableEntityIdentifiers);
                                this.getLogger().debug('Sending biome definitions');
                                // eslint-disable-next-line no-case-declarations
                                const biomeDefinitionListPacket = new BiomeDefinitionListPacket();
                                biomeDefinitionListPacket.nbt = biome_definition_list;
                                player.sendDataPacket(biomeDefinitionListPacket);
                                // eslint-disable-next-line no-case-declarations
                                const creativeContentPacket = new CreativeContentPacket();
                                creativeContentPacket.items = creative_content;
                                player.sendDataPacket(creativeContentPacket);
                                // eslint-disable-next-line no-case-declarations
                                const setCommandsEnabledPacket = new SetCommandsEnablePacket();
                                setCommandsEnabledPacket.value = true;
                                player.sendDataPacket(setCommandsEnabledPacket);
                                // eslint-disable-next-line no-case-declarations
                                const updateAttributesPacket = new UpdateAttributesPacket();
                                updateAttributesPacket.runtime_entity_id = player.getId();
                                updateAttributesPacket.attributes = update_attributes;
                                updateAttributesPacket.tick = 0;
                                // eslint-disable-next-line no-case-declarations
                                const itemComponentPacket = new ItemComponentPacket();
                                itemComponentPacket.items = [];
                                player.sendDataPacket(itemComponentPacket);
                                player.setChunkRadius(world.getChunkRadius()); //TODO: Change to world chunk radius
                                // eslint-disable-next-line no-case-declarations
                                const clientCacheStatusPacket = new ClientCacheStatusPacket();
                                clientCacheStatusPacket.enabled = true;
                                player.sendDataPacket(clientCacheStatusPacket);
                                // eslint-disable-next-line no-case-declarations
                                const networkChunkPublisherUpdatePacket = new NetworkChunkPublisherUpdatePacket();
                                networkChunkPublisherUpdatePacket.coordinates = new Vector3(0, 0, 0);
                                networkChunkPublisherUpdatePacket.radius = player.getViewDistance() * 16;
                                networkChunkPublisherUpdatePacket.saved_chunks = [];
                                player.sendDataPacket(networkChunkPublisherUpdatePacket);
                                break;
                        }
                        break;
                }
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
        return this.baseLogger;
    }

    /**
     * Get server language
     */
    getLanguage() {
        return this.language;
    }

    /**
     * Get world manager
     */
    getWorldManager(): WorldManager {
        return this.worldManager;
    }

    /**
     * Get server players
     *
     * @param event
     * @param args
     */
    callEvent(event: string, ...args: any[]) {
        this.events.emit(event, ...args);
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
