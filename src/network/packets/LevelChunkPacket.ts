import { DataPacket } from './DataPacket';
import { ChunkPosition } from './types/ChunkPosition';

export class LevelChunkPacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public chunkPosition: ChunkPosition;
    public subChunkCount: number = 0;
    public highestSubChunkIndex: number = 0;
    public cacheEnabled: boolean = false;
    public blobs: any[] = []; // if cache is enabled
    public payload: Buffer = Buffer.alloc(0);

    constructor() {
        super('level_chunk');
    }

    decode(): void {}

    encode(): object {
        return {
            x: this.chunkPosition.getX(),
            z: this.chunkPosition.getZ(),
            sub_chunk_count: this.subChunkCount,
            highest_subchunk_count: this.highestSubChunkIndex,
            cache_enabled: this.cacheEnabled,
            blobs: this.blobs,
            payload: this.payload
        };
    }
}
