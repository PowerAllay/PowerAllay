import { Vector3 } from '../math/Vector3';
import { Generator } from './generator/Generator';

export class World {
    public static readonly DIFFICULTY_PEACEFUL = 0;
    public static readonly DIFFICULTY_EASY = 1;
    public static readonly DIFFICULTY_NORMAL = 2;
    public static readonly DIFFICULTY_HARD = 3;

    private chunkRadius: number = 4;
    private difficulty: number = 1;
    private spawnPosition: Vector3 = new Vector3(0, 0, 0);
    private generator: number = Generator.FLAT;
    private time: number = 0;

    constructor(private readonly name: string) {}

    getDisplayName(): string {
        return this.name;
    }

    getChunkRadius(): number {
        return this.chunkRadius;
    }

    getDifficulty(): number {
        return this.difficulty;
    }

    getSpawnPosition(): Vector3 {
        return this.spawnPosition;
    }

    getGenerator(): number {
        return this.generator;
    }

    getTime(): number {
        return this.time;
    }
}
