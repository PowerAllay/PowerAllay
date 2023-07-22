import { DataPacket } from './DataPacket';

export class ItemComponentPacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public items: object;

    constructor() {
        super('item_component');
    }

    decode(): void {}

    encode(): object {
        return {
            entries: this.items
        };
    }
}
