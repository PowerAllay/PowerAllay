import { Player } from 'bedrock-protocol';
import { DataPacket } from '../network/packets/DataPacket';
import { ClientInfo } from './ClientInfo';

export class Client {
    private _client: Player;
    private readonly clientInfo: ClientInfo;
    private readonly uuid: string;
    private readonly name: string;

    constructor(player: Player) {
        this._client = player;
        const playerData = player.getUserData();
        // @ts-ignore
        this.clientInfo = new ClientInfo(
            player.profile.xuid,
            playerData.displayName
        );
        // @ts-ignore
        this.uuid = playerData.identity;
        this.name = player.profile.name;
    }

    sendDataPacket(packet: DataPacket): void {
        this._client.queue(packet.name, packet.encode());
    }
}
