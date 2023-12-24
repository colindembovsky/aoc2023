import { CharMap, Position } from "../utils/mapUtils";
import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.EASY);
let lines = contents.split("\n");
let garden = new CharMap(lines);

class GardenPos extends Position {
    canReach: GardenPos[] = [];
    constructor(row: number, col: number) {
        super(row, col);
    }

    resolveNeighbors() {
        for (let n of this.getNeighbors(0, garden.height, 0, garden.width)) {
            if (garden.get(n) == ".") {
                this.canReach.push(new GardenPos(n.row, n.col));
            }
        }
    }

    get(pos: GardenPos): string | undefined {
        return garden.get(this);
    }
}

console.log(`==== ${day}: PART 1 ====`);

// see how many leaf nodes we get to in 6 steps
let start;
for (let row = 0; row < garden.height; row++) {
    for (let col = 0; col < garden.width; col++) {
        if (garden.getAt(row, col) == "S") {
            start = new GardenPos(row, col);
            start.resolveNeighbors();
            break;
        }
    }
}

let reachable = new Map<string, GardenPos>();
reachable.set(start!.toString(), start!);
let stack = [start!];
for (let step = 0; step < 6; step++) {
    let nextStack = [];
    for (let pos of stack) {
        for (let n of pos!.canReach) {
            if (!reachable.has(n.toString())) {
                reachable.set(n.toString(), n);
                nextStack.push(n);
            }
        }
    }
    stack = nextStack;
}
console.log(reachable.size);
