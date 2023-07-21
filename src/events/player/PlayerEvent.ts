import { Client } from '../../player/Client';
import { AllayEvent } from '../AllayEvent';

export class PlayerEvent extends AllayEvent {
    private readonly player: Client;

    constructor(player: Client) {
        super();
        this.player = player;
    }

    getPlayer(): Client {
        return this.player;
    }
}
