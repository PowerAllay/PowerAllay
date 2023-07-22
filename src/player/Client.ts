// @ts-nocheck
import { Player } from 'bedrock-protocol';
import { DataPacket } from '../network/packets/DataPacket';
import { ClientInfo } from './ClientInfo';
import { PowerAllay } from '../PowerAllay';
import { Gamemode } from '../network/packets/types/Gamemode';
import { ClientPermissions } from '../network/packets/types/ClientPermissions';

export class Client {
    private _client: Player;
    private readonly clientInfo: ClientInfo;
    private readonly uuid: string;
    private readonly name: string;
    private readonly server: PowerAllay;
    private readonly gamemode: number = 0;
    constructor(
        server: PowerAllay,
        player: Player,
        data: object | null = null
    ) {
        this._client = player;
        const playerData = player.getUserData();
        this.clientInfo = data
            ? new ClientInfo(data.clientInfo.xuid, data.clientInfo.name)
            : new ClientInfo(player.profile.xuid, player.profile.name);
        this.uuid = data ? data.uuid : player.profile.xuid;
        this.name = data ? data.name : player.profile.name;
        this.server = server;
        this.gamemode = data
            ? data.gamemode
            : this.server.getProperties().get('default-gamemode');
        this.permissionLevel = data
            ? data.permissionLevel
            : ClientPermissions.PERMISSION_NORMAL;
    }

    /**
     * Get client info
     */
    getClientInfo(): ClientInfo {
        return this.clientInfo;
    }

    /**
     * Get client uuid
     */
    getSaveData(): object {
        return {
            clientInfo: this.getClientInfo(),
            uuid: this.uuid,
            name: this.name,
            gamemode: this.gamemode,
            permissionLevel: this.permissionLevel
        };
    }

    /**
     * Get server
     */
    getServers(): PowerAllay {
        return this.server;
    }

    /**
     * Get client session
     */
    getSession(): Player {
        return this._client;
    }

    /**
     * get client gamemode
     */
    getGamemode(): number {
        return this.gamemode;
    }

    /**
     * get client permission level
     */
    getPermissionLevel(): number {
        return this.permissionLevel;
    }

    /**
     * Get client name
     *
     * @param packet
     */
    sendDataPacket(packet: DataPacket): void {
        if (packet.isQueued) {
            this._client.queue(packet.name, packet.encode());
        } else {
            this._client.write(packet.name, packet.encode());
        }
    }
}
