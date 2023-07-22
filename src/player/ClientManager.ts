import { PowerAllay } from '../PowerAllay';
import * as fs from 'fs';
import path from 'path';
import { Client } from './Client';
import { Player } from 'bedrock-protocol';
import * as zlib from 'zlib';
import { Buffer } from 'buffer';
import { Events } from '../events/AllayEvent';
import { PlayerJoinEvent } from '../events/player/PlayerJoinEvent';

export class ClientManager {
    private readonly server: PowerAllay;

    constructor(server: PowerAllay) {
        this.server = server;
        const playersPath = path.join(this.server.getDataPath(), 'players');
        if (!fs.existsSync(playersPath)) {
            fs.mkdirSync(playersPath);
        }
    }

    public getPlayer(player: Player): Client {
        const playerName = player.profile.name;
        const playerPath = path.join(
            this.server.getDataPath(),
            'players',
            `${playerName}.dat`
        );
        if (!fs.existsSync(playerPath)) {
            this.server.getLogger().info('Creating player data...');
            const client = new Client(this.server, player);
            this.server.callEvent(
                Events.PLAYER_JOIN_EVENT,
                new PlayerJoinEvent(client, true)
            );
            this.saveData(client);
            return client;
        } else {
            this.server.getLogger().info('Loading player data...');
            return this.loadData(player);
        }
    }

    private saveData(player: Client): void {
        const playerPath = path.join(
            this.server.getDataPath(),
            'players',
            `${player.getClientInfo().getName()}.dat`
        );
        const contents = zlib.deflateSync(
            Buffer.from(JSON.stringify(player.getSaveData()))
        );
        fs.writeFileSync(playerPath, contents);
    }

    private loadData(player: Player): Client {
        const playerPath = path.join(
            this.server.getDataPath(),
            'players',
            `${player.profile.name}.dat`
        );
        const contents = fs.readFileSync(playerPath);
        const data = JSON.parse(zlib.inflateSync(contents).toString());
        const client = new Client(this.server, player, data);
        this.server.callEvent(
            Events.PLAYER_JOIN_EVENT,
            new PlayerJoinEvent(client, false)
        );
        return client;
    }
}
