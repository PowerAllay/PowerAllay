import { DataPacket } from './DataPacket';

export class ResourcePacksInfoPacket extends DataPacket {
    public readonly name: string = 'resource_packs_info';
    public mustAccept: boolean = false;
    public hasScripts: boolean = false;
    public behaviourPackInfos: any[] = [];
    public resourcePackInfos: any[] = [];

    encode(): object {
        return {
            must_accept: this.mustAccept,
            has_scripts: this.hasScripts,
            behaviour_packs: this.behaviourPackInfos,
            texture_packs: this.resourcePackInfos
        };
    }
}