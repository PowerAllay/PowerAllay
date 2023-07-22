export class PlayerMovementSettings {
    public static readonly CLIENT: number = 0; // MovePlayerPacket::MODE_NORMAL
    public static readonly SERVER: number = 1; // PlayerAuthInputPacket::MODE_SERVER
    public static readonly SERVER_WITH_REWIND: number = 2; //TODO

    constructor(
        private readonly movementAuthority: number,
        private readonly rewindHistorySize: number,
        private readonly serverAuthoritativeBlockBreaking: boolean
    ) {}

    public getMovementAuthority(): number {
        return this.movementAuthority;
    }

    public getRewindHistorySize(): number {
        return this.rewindHistorySize;
    }

    public isServerAuthoritativeBlockBreaking(): boolean {
        return this.serverAuthoritativeBlockBreaking;
    }
}
