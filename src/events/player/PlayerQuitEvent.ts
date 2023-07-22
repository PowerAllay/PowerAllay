import { PlayerEvent } from './PlayerEvent';
import { Client } from '../../player/Client';

export class PlayerQuitEvent extends PlayerEvent {
    constructor(player: Client) {
        super(player);
    }
}
