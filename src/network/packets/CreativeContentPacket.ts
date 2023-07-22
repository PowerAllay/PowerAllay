import { DataPacket } from './DataPacket';

export class CreativeContentPacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public items: object = {};

    constructor() {
        super('creative_content');
    }

    decode(): void {}

    encode(): object {
        return {
            items: this.items
        };
    }
}
