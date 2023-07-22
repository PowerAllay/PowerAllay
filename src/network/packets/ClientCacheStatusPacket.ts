import { DataPacket } from './DataPacket';

export class ClientCacheStatusPacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public enabled: boolean = false;

    constructor() {
        super('client_cache_status');
    }

    decode(): void {}

    encode(): object {
        return {
            enabled: this.enabled
        };
    }
}
