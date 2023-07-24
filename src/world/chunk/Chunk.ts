import { subChunk } from './subChunk';
import { ChunkException } from '../../exception/ChunkException';
import { Block } from '../../block/Block';

export class Chunk {
    public static readonly MAX_SUBCHUNKS: number = 16;
    protected height: number;
    protected emptySubChunk: subChunk = new subChunk();

    constructor(
        public x: number = 0,
        public z: number = 0,
        private subChunks: Map<number, subChunk> = new Map()
    ) {
        this.height = Chunk.MAX_SUBCHUNKS;
        const MIN_SUBCHUNK_INDEX: number = -4;
        subChunks.forEach((subChunk: subChunk, y: number) => {
            console.log(y);
        });
    }

    getX(): number {
        return this.x;
    }

    getZ(): number {
        return this.z;
    }

    setX(x: number): void {
        this.x = x;
    }

    setZ(z: number): void {
        this.z = z;
    }

    getHeight(): number {
        return this.height;
    }

    getSubChunk(y: number): subChunk {
        if (y < -4 || y > Chunk.MAX_SUBCHUNKS) {
            throw new ChunkException('SubChunk out of range');
        }
        if (this.subChunks.has(y)) {
            return this.subChunks.get(y);
        }
        return this.emptySubChunk;
    }

    setBlock(x: number, y: number, z: number, block: Block): void {
        const subChunkIndex: number = Math.floor(y / Chunk.MAX_SUBCHUNKS);
        if (subChunkIndex >= 0 && subChunkIndex < Chunk.MAX_SUBCHUNKS) {
            const subChunk: subChunk = this.getSubChunk(subChunkIndex);
            subChunk.setBlock(x, y, z, block);
        }
    }
}
