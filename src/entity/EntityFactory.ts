export class EntityFactory {
    private static runtimeId: number = 1;

    static getNextRuntimeId(): number {
        return this.runtimeId++;
    }
}
