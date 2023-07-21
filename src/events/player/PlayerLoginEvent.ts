import { PlayerEvent } from './PlayerEvent';
import { LogicException } from '../../exception/LogicException';

export class PlayerLoginEvent extends PlayerEvent {
    setCancelled(cancelled: boolean) {
        super.setCancelled(cancelled);
        throw new LogicException('Cannot cancel PlayerLoginEvent');
    }
}
