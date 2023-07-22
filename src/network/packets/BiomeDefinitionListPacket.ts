import { DataPacket } from './DataPacket';

export class BiomeDefinitionListPacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public nbt: any[] = [];

    constructor() {
        super('biome_definition_list');
    }

    decode(): void {}

    encode(): object {
        return this.nbt;
    }
}
