import { Vector3 } from '../math/Vector3';
import { Generator } from './generator/Generator';
import { Position } from './Position';
import { Dimension } from './dimension/Dimension';

export class World {
    public static readonly DIFFICULTY_PEACEFUL = 0;
    public static readonly DIFFICULTY_EASY = 1;
    public static readonly DIFFICULTY_NORMAL = 2;
    public static readonly DIFFICULTY_HARD = 3;

    private chunkRadius = 64;
    private difficulty = 1;
    private spawnPosition: Position = new Position(0, 0, 0, this);
    private generator: number = Generator.FLAT;
    private dimension: number = Dimension.OVERWORLD;
    private time = 0;

    constructor(private readonly name: string) {
        this.setDimension(Dimension.OVERWORLD);
    }

    getDisplayName(): string {
        return this.name;
    }

    getChunkRadius(): number {
        return this.chunkRadius;
    }

    getDifficulty(): number {
        return this.difficulty;
    }

    getSpawnPosition(): Position {
        return this.spawnPosition;
    }

    getGenerator(): number {
        return this.generator;
    }

    getDemension(): number {
        return this.dimension;
    }

    setDimension(dimension: number): void {
        this.dimension = dimension;
    }

    getTime(): number {
        return this.time;
    }
}
