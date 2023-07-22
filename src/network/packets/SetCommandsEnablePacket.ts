import {DataPacket} from "./DataPacket";

export class SetCommandsEnablePacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public value: boolean = false;

    constructor() {
        super('set_commands_enabled');
    }

    decode(): void {
    }

    encode(): object {
        return {
            enabled: this.value
        }
    }
}