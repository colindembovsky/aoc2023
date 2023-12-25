import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.EASY);
let lines = contents.split("\n");

interface Point {
    x: number;
    y: number;
    z: number;
}

class Brick {
    start: Point;
    end: Point;

    constructor(line: string) {
        let [left, right] = line.split("~");
        this.start = this.parsePoint(left);
        this.end = this.parsePoint(right);
    }

    parsePoint(point: string): Point {
        let [x, y, z] = point.split(",");
        return { x: parseInt(x), y: parseInt(y), z: parseInt(z) };
    }

    get maxZ(): number {
        return Math.max(this.start.z, this.end.z);
    }

    get maxX(): number {
        return Math.max(this.start.x, this.end.x);
    }

    get maxY(): number {
        return Math.max(this.start.y, this.end.y);
    }

    get minZ(): number {
        return Math.min(this.start.z, this.end.z);
    }

    get minX(): number {
        return Math.min(this.start.x, this.end.x);
    }

    get minY(): number {
        return Math.min(this.start.y, this.end.y);
    }

    moveDown(): void {
        this.start.z--;
        this.end.z--;
    }

    overlapBrickInZ(other: Brick): boolean {
        return this.maxX >= other.minX && this.minX <= other.maxX &&
            this.maxY >= other.minY && this.minY <= other.maxY;
    }

    zDistanceTo(brick: Brick): number {
        return Math.abs(this.maxZ - brick.maxZ);
    }

    isAtLeastOneAbove(z: number): boolean {
        return this.minZ > z + 1;
    }

    intersectZ(z: number) {
        return this.minZ <= z && this.maxZ >= z;
    }
}

console.log(`==== ${day}: PART 1 ====`);
let bricks = lines.map((line) => new Brick(line));