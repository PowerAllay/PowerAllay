import { DataPacket } from './DataPacket';

export class PlayStatusPacket extends DataPacket {
    public readonly isQueued: boolean = true;

    public static readonly LOGIN_SUCCESS: number = 0;
    public static readonly LOGIN_FAILED_CLIENT: number = 1;
    public static readonly LOGIN_FAILED_SERVER: number = 2;
    public static readonly PLAYER_SPAWN: number = 3;
    public static readonly LOGIN_FAILED_INVALID_TENANT: number = 4;
    public static readonly LOGIN_FAILED_VANILLA_EDU: number = 5;
    public static readonly LOGIN_FAILED_EDU_VANILLA: number = 6;
    public static readonly LOGIN_FAILED_SERVER_FULL: number = 7;
    public static readonly LOGIN_FAILED_EDITOR_VANILLA: number = 8;
    public static readonly LOGIN_FAILED_VANILLA_EDITOR: number = 9;

    public status: number;

    constructor() {
        super('play_status');
    }

    decode(): void {}

    encode(): object {
        return {
            status: this.status
        };
    }
}
