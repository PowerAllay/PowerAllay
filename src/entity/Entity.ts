import { EntityFactory } from './EntityFactory';

export class Entity {
    private readonly runtimeId: number;

    public constructor() {
        this.runtimeId = EntityFactory.getNextRuntimeId();
    }

    getId(): number {
        return this.runtimeId;
    }
}
