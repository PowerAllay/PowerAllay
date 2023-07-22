export abstract class DataPacket {
    public readonly name: string;

    protected constructor(name: string) {
        this.name = name;
    }

    abstract encode(): object;
    abstract decode(): void;
}
