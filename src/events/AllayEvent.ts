export class AllayEvent {
    private cancelled: boolean;
    constructor() {
        this.cancelled = false;
    }
    isCancelled() {
        return this.cancelled;
    }
    setCancelled(cancelled: boolean) {
        this.cancelled = cancelled;
    }
}
