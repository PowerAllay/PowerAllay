import { DataPacket } from './DataPacket';

export class ChunkRadiusUpdatePacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public radius: number;

    constructor() {
        super('chunk_radius_update');
    }

    decode(): void {}

    encode(): object {
        return {
            chunk_radius: this.radius
        };
    }
}
