import { Player } from 'bedrock-protocol';
import { DataPacket } from '../network/packets/DataPacket';
import { ClientInfo } from './ClientInfo';
import { PowerAllay } from '../PowerAllay';

export class Client {
    private _client: Player;
    private readonly clientInfo: ClientInfo;
    private readonly uuid: string;
    private readonly name: string;
    private readonly server: PowerAllay;

    constructor(
        server: PowerAllay,
        player: Player,
        data: object | null = null
    ) {
        this._client = player;
        const playerData = player.getUserData();
        // @ts-ignore
        // prettier-ignore
        this.clientInfo = data ? new ClientInfo(data.clientInfo.xuid, data.clientInfo.name)
                                : new ClientInfo(player.profile.xuid, player.profile.name);
        // @ts-ignore
        this.uuid = playerData.identity;
        this.name = player.profile.name;
        this.server = server;
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
            name: this.name
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
