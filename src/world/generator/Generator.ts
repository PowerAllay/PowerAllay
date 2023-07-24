import { Vector3 } from '../../math/Vector3';
import { ChunkPosition } from '../../network/packets/types/ChunkPosition';

export abstract class Generator {
    public static readonly LEGACY: number = 0;
    public static readonly OVERWORLD: number = 1;
    public static readonly FLAT: number = 2;
    public static readonly NETHER: number = 3;
    public static readonly END: number = 4;
    public static readonly CAVES: number = 5;

    private static list: { [key: string]: Generator } = {};

    constructor(
        public readonly seed: number = 0,
        public readonly layers: any[] = []
    ) {}

    public static register(generator: Generator, name: string): void {
        this.list[name] = generator;
    }

    public static get(name: string): Generator {
        if (this.list[name]) {
            return this.list[name];
        }
        throw new Error(`Generator ${name} not found`);
    }

    abstract getName(): string;
    abstract generateChunk(chunkPosition: ChunkPosition): void;
    abstract populateChunk(chunkPosition: ChunkPosition): void;
    abstract getSpawn(): Vector3;
}
