import { Block } from './Block';
import { BlockIdentifier } from './BlockIdentifier';
import { BlockIds } from './BlockIds';

export class Bedrock extends Block {
    constructor() {
        super(new BlockIdentifier('minecraft:bedrock'), BlockIds.BEDROCK);
    }
}
