import { PlayerEvent } from './PlayerEvent';
import { Client } from '../../player/Client';

export class PlayerJoinEvent extends PlayerEvent {
    private readonly isFirstJoin: boolean;

    constructor(player: Client, isFirstJoin: boolean) {
        super(player);
        this.isFirstJoin = isFirstJoin;
    }

    public isJoinBefore(): boolean {
        return !this.isFirstJoin;
    }
}
