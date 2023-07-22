export class AllayEvent {
    private cancelled: boolean;
    protected constructor() {
        this.cancelled = false;
    }

    isCancelled() {
        return this.cancelled;
    }
    setCancelled(cancelled: boolean) {
        this.cancelled = cancelled;
    }
}

export class Events {
    public static readonly PLAYER_LOGIN_EVENT: string = 'player.login.event';
    public static readonly PLAYER_JOIN_EVENT: string = 'player.join.event';
    public static readonly PLAYER_QUIT_EVENT: string = 'player.quit.event';
}
