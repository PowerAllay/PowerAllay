import { DataPacket } from './DataPacket';

export class ResourcePackResponsePacket extends DataPacket {
    public static readonly HAVE_ALL_PACK: string = 'have_all_packs';

    constructor() {
        super('resource_pack_client_response');
    }

    decode(): void {}

    encode(): object {
        return {};
    }
}
