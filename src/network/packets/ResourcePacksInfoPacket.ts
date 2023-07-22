import { DataPacket } from './DataPacket';

export class ResourcePacksInfoPacket extends DataPacket {
    public readonly isQueued: boolean = true;
    public mustAccept: boolean = false;
    public hasScripts: boolean = false;
    public behaviourPackInfos: any[] = [];
    public resourcePackInfos: any[] = [];

    constructor() {
        super('resource_packs_info');
    }

    encode(): object {
        return {
            must_accept: this.mustAccept,
            has_scripts: this.hasScripts,
            behaviour_packs: this.behaviourPackInfos,
            texture_packs: this.resourcePackInfos
        };
    }

    decode(): void {}
}
