import { DataPacket } from './DataPacket';

export class UpdateAttributesPacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public runtime_entity_id: number;
    public attributes: object = {};
    public tick: number = 0;

    constructor() {
        super('update_attributes');
    }
    decode() {}
    encode() {
        return {
            runtime_entity_id: this.runtime_entity_id,
            attributes: this.attributes,
            tick: this.tick
        };
    }
}
