export abstract class DataPacket {
    public readonly name: string;
    public readonly isQueued: boolean = false;

    protected constructor(name: string) {
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    abstract encode(): object;
    abstract decode(): void;
}
