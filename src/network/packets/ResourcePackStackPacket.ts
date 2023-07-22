import { DataPacket } from './DataPacket';

export class ResourcePackStackPacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public mustAccept: boolean = false;
    public behaviourPackInfos: any[] = [];
    public resourcePackInfos: any[] = [];
    public gameVersion: string = '1.20.10';
    public experiments: any[] = [];
    public experimentsPreviouslyUsed: boolean = false;

    constructor() {
        super('resource_pack_stack');
    }

    decode(): void {}

    encode(): object {
        return {
            must_accept: this.mustAccept,
            behavior_packs: this.behaviourPackInfos,
            resource_packs: this.resourcePackInfos,
            game_version: this.gameVersion,
            experiments: this.experiments,
            experiments_previously_used: this.experimentsPreviouslyUsed
        };
    }
}
