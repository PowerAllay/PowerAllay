import { Generator } from './Generator';
import { Vector3 } from '../../math/Vector3';
import { ChunkPosition } from '../../network/packets/types/ChunkPosition';
import { Chunk } from '../chunk/Chunk';
import { BlockFactory } from '../../block/BlockFactory';
import { Block } from '../../block/Block';

export class Flat extends Generator {
    private chunk: any = {};

    constructor() {
        super(0, [
            {
                block: 'minecraft:bedrock',
                height: 1
            },
            {
                block: 'minecraft:dirt',
                height: 2
            },
            {
                block: 'minecraft:grass',
                height: 1
            }
        ]);
        this.chunk = null;
    }

    getName(): string {
        return 'flat';
    }

    async generateChunk(chunkPosition: ChunkPosition): Promise<Chunk> {
        const chunkX = chunkPosition.getX();
        const chunkZ = chunkPosition.getZ();
        const blocks: Block[] = [];
        this.layers.forEach((layer) => {
            const block = BlockFactory.getBlock(layer.block);
            for (let y = 0; y < layer.height; y++) {
                blocks.push(block);
            }
        });
        return new Promise((resolve) => {
            const chunk = new Chunk(chunkX, chunkZ);
            for (let x = 0; x < Chunk.MAX_SUBCHUNKS; x++) {
                for (let z = 0; z < Chunk.MAX_SUBCHUNKS; z++) {
                    for (let y = 0; y < Chunk.MAX_SUBCHUNKS; y++) {
                        chunk.setBlock(x, y, z, blocks[y]);
                    }
                }
            }
            resolve(chunk);
        });
    }

    getSpawn(): Vector3 {
        return undefined;
    }

    populateChunk(chunkPosition: ChunkPosition): void {}
}
