import * as fs from 'fs';


export const types = {
    json: 0
};

export class Config {

    readonly filename: string;
    readonly ConfigType: number;
    config: any;

    constructor(filename: string, ConfigType: number, defaultText: any = []) {
        this.filename = filename;
        this.ConfigType = ConfigType;
        this.config = defaultText;
        fs.existsSync(this.filename) ? this.load() : this.save();
    }

    load() {
        switch (this.ConfigType) {
            case types.json:
                this.config = JSON.parse(fs.readFileSync(this.filename, 'utf-8'));
                break;
        }
    }

    async save() {
        switch (this.ConfigType) {
            case types.json:
                fs.writeFileSync(
                    this.filename,
                    JSON.stringify(this.config, null, 4)
                );
                break;
        }
    }
}