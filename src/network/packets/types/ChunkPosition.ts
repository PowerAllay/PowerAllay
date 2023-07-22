export class ChunkPosition {
    constructor(
        public x: number,
        public z: number
    ) {}

    getX(): number {
        return this.x;
    }

    getZ(): number {
        return this.z;
    }

    toJSON(): object {
        return {
            x: this.x,
            z: this.z
        };
    }
}
