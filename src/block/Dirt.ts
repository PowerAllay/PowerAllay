import { BlockIdentifier } from './block/BlockIdentifier';
import { BlockIds } from './block/BlockIds';
import { Block } from './block/Block';

export class Dirt extends Block {
    constructor() {
        super(new BlockIdentifier('minecraft:dirt'), BlockIds.DIRT);
    }
}
