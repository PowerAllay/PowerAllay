import { BlockIdentifier } from './BlockIdentifier';

export abstract class Block {
    public static readonly EMPTY_BLOCK_ID: number = 0;

    protected constructor(
        private blockidentifier: BlockIdentifier,
        private id: number,
        private meta: number = 0
    ) {}

    getNetworkId(): string {
        return this.blockidentifier.networkId;
    }

    getId(): number {
        return this.id;
    }

    getMeta(): number {
        return this.meta || 0;
    }
}
