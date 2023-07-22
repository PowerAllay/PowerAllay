export abstract class AllayEvent {
    private cancelled: boolean;
    protected constructor() {
        this.cancelled = false;
    }

    abstract getEventName(): string;

    isCancelled() {
        return this.cancelled;
    }
    setCancelled(cancelled: boolean) {
        this.cancelled = cancelled;
    }
}

export class Events {
    public static readonly PLAYER_LOGIN_EVENT: string = 'player.login.event';
}
