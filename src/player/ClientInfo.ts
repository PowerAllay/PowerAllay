export class ClientInfo {
    private readonly xuid: string;
    private readonly name: string;

    constructor(xuid: string, name: string) {
        this.xuid = xuid;
        this.name = name;
    }

    public getXuid(): string {
        return this.xuid;
    }

    public getName(): string {
        return this.name;
    }
}
