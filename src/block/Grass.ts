import { Block } from './Block';
import { BlockIdentifier } from './BlockIdentifier';
import { BlockIds } from './BlockIds';

export class Grass extends Block {
    constructor() {
        super(new BlockIdentifier('minecraft:grass'), BlockIds.GRASS);
    }
}
