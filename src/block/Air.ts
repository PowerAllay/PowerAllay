import { Block } from './Block';
import { BlockIds } from './BlockIds';
import { BlockIdentifier } from './BlockIdentifier';

export class Air extends Block {
    constructor() {
        super(new BlockIdentifier('minecraft:air'), BlockIds.AIR);
    }
}
