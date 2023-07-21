import { PowerAllay } from "../PowerAllay";
import { LogicException } from "../exception/LogicException";
import * as fs from "fs";

export const languages: any = {
    'en_US': 'English',
}
export class Language {
    readonly server: PowerAllay;
    readonly currentLanguage: any;
    readonly languages: any = languages;

    constructor(server: PowerAllay) {
        this.server = server;
        this.currentLanguage = this.server.getProperties().get('language');
        if (this.getName() === undefined) {
            throw new LogicException(`Language ${this.currentLanguage} not found!`);
        } else {
            this.languages = JSON.parse(fs.readFileSync(`${this.server.getDataPath()}/src/languages/${this.currentLanguage}.json`, 'utf-8'));
        }
    }

    getName() {
        return languages[this.currentLanguage];
    }

    getLanguage() {
        return this.currentLanguage;
    }

    translate(key: string, ...args: any[]) {
        let message = this.languages[key];
        if (message === undefined) {
            throw new LogicException(`Language key ${key} not found!`);
        } else {
            for (let i = 0; i < args.length; i++) {
                message = message.replace(`{${i}}`, args[i]);
            }
            return message;
        }
    }
}