import { BlockIdentifier } from './BlockIdentifier';
import { BlockIds } from './BlockIds';
import { Block } from './Block';

export class Dirt extends Block {
    constructor() {
        super(new BlockIdentifier('minecraft:dirt'), BlockIds.DIRT);
    }
}
