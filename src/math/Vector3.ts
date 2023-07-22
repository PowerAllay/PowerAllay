export class Vector3 {

    constructor(
        public x: number,
        public y: number,
        public z: number
    ) {}

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getZ(): number {
        return this.z;
    }
}