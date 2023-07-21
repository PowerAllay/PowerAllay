import { PowerAllay } from '../PowerAllay';

export const levels = {
    info: 0,
    warn: 1,
    error: 2,
    debug: 3,
    trace: 4
};

export class BaseLogger {
    readonly server: PowerAllay;
    readonly timezone: string;
    constructor(server: PowerAllay) {
        this.server = server;
        this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    getTimezone() {
        return this.timezone;
    }

    info(message: string) {
        this.log(message, levels.info);
    }

    warn(message: string) {
        this.log(message, levels.warn);
    }

    error(message: string) {
        this.log(message, levels.error);
    }

    debug(message: string) {
        this.log(message, levels.debug);
    }

    trace(message: string) {
        this.log(message, levels.trace);
    }

    private getTime() {
        const dateTimeString = new Date().toLocaleString('en-US', {
            timeZone: this.getTimezone()
        });
        return dateTimeString.split(' ')[1];
    }

    private log(message: string, level: number) {
        let format = '';
        const time = this.getTime();
        switch (level) {
            case levels.info:
                format = `[${time}] [INFO]: ${message}`;
                break;
            case levels.warn:
                format = `[${time}] [WARN]: ${message}`;
                break;
            case levels.error:
                format = `[${time}] [ERROR]: ${message}`;
                break;
            case levels.debug:
                format = `[${time}] [DEBUG]: ${message}`;
                break;
            case levels.trace:
                format = `[${time}] [TRACE]: ${message}`;
                break;
        }
        console.log(format);
    }
}
