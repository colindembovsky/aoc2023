import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);
let lines = contents.split("\n");

interface Point {
    x: number;
    y: number;
    z: number;
}

class Brick {
    static bricks: Brick[] = [];
    start: Point;
    end: Point;
    supports: Brick[] = [];
    supportedBy: Brick[] = [];

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

    overlapsVertically(other: Brick): boolean {
        return this.maxX >= other.minX && this.minX <= other.maxX &&
            this.maxY >= other.minY && this.minY <= other.maxY;
    }

    intersectsZAt(z: number) {
        return this.minZ <= z && this.maxZ >= z;
    }

    calcSupport() {
        this.supportedBy = Brick.bricks.filter(brick => brick !== this && brick.intersectsZAt(this.minZ - 1) && brick.overlapsVertically(this));
        this.supports = Brick.bricks.filter(brick => brick !== this && brick.intersectsZAt(this.maxZ + 1) && brick.overlapsVertically(this));
    }
}

console.log(`==== ${day}: PART 1 ====`);
Brick.bricks = lines.map((line) => new Brick(line));

let movedBrick = true;
let moveCount = 0;
while (movedBrick) {
    console.log(`Bricks falling... ${moveCount++}`);
    movedBrick = false;
    for (let brick of Brick.bricks) {
        while(true) {
            let bottom = brick.minZ;
            if (bottom === 1) {
                break;
            }
            let blockingBricks = Brick.bricks.filter(other => other !== brick && other.intersectsZAt(bottom - 1) && other.overlapsVertically(brick));
            if (blockingBricks.length === 0) {
                brick.moveDown();
                movedBrick = true;
            } else {
                break;
            }
        }
    }
}
console.log("Bricks have settled");
Brick.bricks.forEach(brick => brick.calcSupport());

let safeToDisintegrate = Brick.bricks.filter(brick => 
    Brick.bricks.filter(other => 
        other !== brick && other.supportedBy.length === 1 && other.supportedBy.indexOf(brick) >= 0
    ).length === 0
);
console.log(safeToDisintegrate.length);