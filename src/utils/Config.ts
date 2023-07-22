import * as fs from 'fs';
import YAML from 'yaml';

export class Config {
    readonly filename: string;
    readonly ConfigType: number;
    config: any;

    public static readonly JSON: number = 0;
    public static readonly YAML: number = 1;

    constructor(filename: string, ConfigType: number, defaultText: any = []) {
        this.filename = filename;
        this.ConfigType = ConfigType;
        this.config = defaultText;
        fs.existsSync(this.filename) ? this.load() : this.save();
    }

    load() {
        switch (this.ConfigType) {
            case Config.JSON:
                this.config = JSON.parse(fs.readFileSync(this.filename, 'utf-8'));
                break;
            case Config.YAML:
                this.config = YAML.parse(fs.readFileSync(this.filename, 'utf-8'));
                break;
        }
    }

    get(key: string) {
        return this.config[key];
    }

    async save() {
        switch (this.ConfigType) {
            case Config.JSON:
                fs.writeFileSync(this.filename, JSON.stringify(this.config, null, 4));
                break;
            case Config.YAML:
                fs.writeFileSync(this.filename, YAML.stringify(this.config));
                break;
        }
    }
}
