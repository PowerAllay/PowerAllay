import { DataPacket } from './DataPacket';

export class AvailableEntityPacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public data: object = {};

    constructor() {
        super('available_entity_identifiers');
    }

    decode(): void {}

    encode(): object {
        return this.data;
    }
}
