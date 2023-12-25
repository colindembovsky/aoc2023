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
            if (garden.get(n) !== "#") {
                this.canReach.push(new GardenPos(n.row, n.col));
            }
        }
    }

    get(pos: GardenPos): string | undefined {
        return garden.get(this);
    }

    get isEdge(): boolean {
        return this.row === 0 || this.row === garden.height - 1 || this.col === 0 || this.col === garden.width - 1;
    }
}

console.log(`==== ${day}: PART 1 ====`);

// see how many leaf nodes we get to in 6 steps
let start: GardenPos | undefined;
for (let row = 0; row < garden.height; row++) {
    for (let col = 0; col < garden.width; col++) {
        if (garden.getAt(row, col) == "S") {
            start = new GardenPos(row, col);
            start.resolveNeighbors();
            break;
        }
    }
}
start = start!;

function printReachable(reachable: GardenPos[]) {
    let map = garden.clone();
    for (let pos of reachable) {
        map.set(pos, "O");
    }
    console.log(map.toString());
}

let stack = [start];
let steps = 64;
// for (let step = 0; step < steps; step++) {
//     let nextStack = [];
//     for (let pos of stack) {
//         for (let n of pos!.canReach) {
//             n.resolveNeighbors();
//             let onStack = nextStack.find(p => p.row === n.row && p.col === n.col);
//             if (!onStack) {
//                 nextStack.push(n);
//             }
//         }
//     }
//     stack = nextStack;
// }
//printReachable(stack);
console.log(stack.length);

console.log(`==== ${day}: PART 1 alternate ====`);
let shortestDistanceFromStart = new Map<string, number>();
stack = [start];
shortestDistanceFromStart.set(start.toString(), 0);
while (stack.length > 0) {
    let pos = stack.pop()!;
    for (let n of pos.canReach) {
        let dist = shortestDistanceFromStart.get(pos.toString())! + 1;
        let nDist = shortestDistanceFromStart.get(n.toString()) ?? Number.MAX_SAFE_INTEGER;
        if (dist < nDist) {
            shortestDistanceFromStart.set(n.toString(), dist);
        }
        stack.push(n);
    }
}
let reachable = Array.from(shortestDistanceFromStart.entries()).filter(([_, v]) => v <= steps && v % 2 === 0);
console.log(reachable.length);

console.log(`==== ${day}: PART 2 ====`);
let shortestDistanceToEdge = new Map<string, number>();
let topCorner = new GardenPos(0, 0);
topCorner.resolveNeighbors();
stack = [topCorner];
let curDist = 1;
while (stack.length > 0) {
    let pos = stack.pop()!;
    for (let n of pos.canReach) {
        n.resolveNeighbors();
        if (n.isEdge) {
            let nDist = shortestDistanceToEdge.get(n.toString()) ?? Number.MAX_SAFE_INTEGER;
            if (curDist < nDist) {
                shortestDistanceToEdge.set(n.toString(), curDist);
            }
        }
        stack.push(n);
    }
    curDist++;
}
console.log("Worked out edge distances");