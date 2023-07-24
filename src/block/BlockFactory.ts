import { Block } from './Block';
import { InvalidArgumentException } from '../exception/InvalidArgumentException';
import * as VanillaBlocks from './VanillaBlocks';

export class BlockFactory {
    private static readonly blocks: Map<string, Block> = new Map();

    static async init(): Promise<void> {
        await Promise.all(
            Object.entries(VanillaBlocks).map(async ([, block]) => BlockFactory.registerBlock(new block()))
        );
    }

    public static async registerBlock(block: Block): Promise<void> {
        if (BlockFactory.blocks.has(block.getNetworkId())) {
            throw new InvalidArgumentException('Block already registered');
        }
        BlockFactory.blocks.set(block.getNetworkId(), block);
    }

    public static getBlock(networkId: string): Block | undefined {
        return BlockFactory.blocks.get(networkId);
    }

    public static getBlockById(id: number, meta: number = 0): Block | undefined {
        if (id > 0xff) {
            throw new InvalidArgumentException('Block id must be between 0 and 255');
        }
        let blocks = Array.from(BlockFactory.blocks.values());
        return blocks.find((block: Block) => {
            return block.getId() === id && block.getMeta() === meta;
        });
    }
}
