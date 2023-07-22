import { Vector3 } from '../math/Vector3';
import { World } from './World';

export class Position extends Vector3 {
    readonly world: World;

    constructor(x: number, y: number, z: number, world: World) {
        super(x, y, z);
        this.world = world;
    }

    asVector3(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }
}
