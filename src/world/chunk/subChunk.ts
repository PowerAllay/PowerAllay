import { Block } from '../../block/Block';

export class subChunk {
    public static readonly COORD_BIT_SIZE = 4; // https://gist.github.com/Tomcc/a96af509e275b1af483b25c543cfbf37
    public static readonly COORD_MASK = ~(~0 << subChunk.COORD_BIT_SIZE);

    constructor(
        private emptyBlockId: number = 0,
        private blocks: Map<number, number> = new Map()
    ) {}

    setBlock(x: number, y: number, z: number, block: Block): void {
        const index: number = this.blocks.get(x & subChunk.COORD_MASK) << subChunk.COORD_BIT_SIZE;
        if (block.getId() === this.emptyBlockId) {
            this.blocks.delete(index);
        } else {
            this.blocks.set(index, block.getId());
        }
    }
}
