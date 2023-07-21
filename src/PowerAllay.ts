import {Config, types} from "./utils/Config";
import * as path from "path";

export class PowerAllay {
    private properties: Config;
    private readonly dataPath: string;

    constructor() {
        this.dataPath = path.join(__dirname, '..');
        this.properties = new Config(`${this.getDataPath()}/server.json`, types.json, {
            'server-port': 19132,
            'motd': 'PowerAllay',
            'max-players': 20,
            'default-world': 'world'
        })
    }

    getDataPath() {
        return this.dataPath;
    }
}
