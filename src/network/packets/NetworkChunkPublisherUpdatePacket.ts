import { DataPacket } from './DataPacket';
import { Vector3 } from '../../math/Vector3';

export class NetworkChunkPublisherUpdatePacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public coordinates: Vector3;
    public radius: number;
    public saved_chunks: Vector3[];

    constructor() {
        super('network_chunk_publisher_update');
    }
    decode(): void {}

    encode(): object {
        return {
            coordinates: this.coordinates.toJSON(),
            radius: this.radius,
            saved_chunks: this.saved_chunks.map((vector) => vector.toJSON())
        };
    }
}
