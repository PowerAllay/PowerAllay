import { DataPacket } from './DataPacket';

export class AvailableCommandsPacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public commands: object;

    constructor() {
        super('available_commands');
    }

    decode(): void {}

    encode(): object {
        return {
            commands: this.commands
        };
    }
}
