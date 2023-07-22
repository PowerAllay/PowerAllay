import { PlayerEvent } from './PlayerEvent';
import { LogicException } from '../../exception/LogicException';
import { ClientInfo } from '../../player/ClientInfo';

export class PlayerLoginEvent extends PlayerEvent {
    constructor(clientInfo: ClientInfo) {
        super(null);
    }

    getClientInfo(): ClientInfo {
        return this.getPlayer().getClientInfo();
    }

    setCancelled(cancelled: boolean) {
        super.setCancelled(cancelled);
        throw new LogicException('Cannot cancel PlayerLoginEvent');
    }
}
