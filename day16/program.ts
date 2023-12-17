import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);
let lines = contents.split("\n");

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
};

class Beam {
    constructor(public row: number, public col: number, public direction: Direction) {}
    
    get posKey() {
        return `${this.row},${this.col}`;
    }

    get fullKey() {
        return `(${this.row}-${this.col}-${this.direction})`;
    }
}

function followBeam(beam: Beam): Beam[] {
    if (beam.row < 0 || beam.row >= lines.length || beam.col < 0 || beam.col >= lines[0].length) return [];
    let tile = lines[beam.row][beam.col];
    let key = beam.posKey;

    // check if we've been here before
    let beams = map.get(key) || [];
    if (beams.find(b => b.fullKey === beam.fullKey)) return [];

    // mark this beam as visited
    beams.push(beam);
    map.set(key, beams);

    switch (tile) {
        case ".": {
            switch(beam.direction) {
                case Direction.UP:
                    return [new Beam(beam.row - 1, beam.col, beam.direction)];
                case Direction.DOWN:
                    return [new Beam(beam.row + 1, beam.col, beam.direction)];
                case Direction.LEFT:
                    return [new Beam(beam.row, beam.col - 1, beam.direction)];
                case Direction.RIGHT:
                    return [new Beam(beam.row,  beam.col + 1, beam.direction)];
            }
        }
        case "/": {
            switch(beam.direction) {
                case Direction.UP:
                    return [ new Beam(beam.row, beam.col + 1, Direction.RIGHT )];
                case Direction.DOWN:
                    return [ new Beam(beam.row, beam.col - 1, Direction.LEFT )];
                case Direction.LEFT:
                    return [ new Beam(beam.row + 1, beam.col, Direction.DOWN )];
                case Direction.RIGHT:
                    return [ new Beam(beam.row - 1, beam.col, Direction.UP )];
            }
        }
        case "\\": {
            switch(beam.direction) {
                case Direction.UP:
                    return [ new Beam(beam.row, beam.col - 1, Direction.LEFT )];
                case Direction.DOWN:
                    return [ new Beam(beam.row, beam.col + 1, Direction.RIGHT )];
                case Direction.LEFT:
                    return [ new Beam(beam.row - 1, beam.col, Direction.UP )];
                case Direction.RIGHT:
                    return [ new Beam(beam.row + 1, beam.col, Direction.DOWN )];
            }
        }
        case "-": {
            switch(beam.direction) {
                case Direction.UP:
                case Direction.DOWN:
                {
                    return [
                        new Beam(beam.row, beam.col + 1, Direction.RIGHT ),
                        new Beam(beam.row, beam.col - 1, Direction.LEFT )
                    ];
                }
                case Direction.LEFT: return [new Beam(beam.row, beam.col - 1, beam.direction )];
                case Direction.RIGHT: return [new Beam(beam.row, beam.col + 1, beam.direction )];
                    
            }
        }
        case "|": {
            switch(beam.direction) {
                case Direction.UP: return [new Beam(beam.row - 1, beam.col, beam.direction )];
                case Direction.DOWN: return [new Beam(beam.row + 1, beam.col, beam.direction )];
                case Direction.LEFT:
                case Direction.RIGHT:
                {
                    return [
                        new Beam(beam.row + 1, beam.col, Direction.DOWN ),
                        new Beam(beam.row - 1, beam.col, Direction.UP )
                    ];
                }
            }
        }
    }
    throw new Error(`Unknown tile ${tile}`);
}

let map = new Map<string, Beam[]>();
let stack: Beam[] = [];

function sendBeam(row: number, col: number, direction: Direction): number {
    map.clear();
    stack = [new Beam(row, col, direction)];
    while (stack.length > 0) {
        stack.push(...followBeam(stack.shift()!));
    }
    return map.size;
}

console.log(`==== ${day}: PART 1 ====`);
console.log(sendBeam(0, 0, Direction.RIGHT));

console.log(`==== ${day}: PART 2 ====`);
let startPositions: Beam[] = [];
for (let col = 0; col < lines[0].length; col++) {
    startPositions.push(new Beam(0, col, Direction.DOWN));
}
for (let row = 0; row < lines.length; row++) {
    startPositions.push(new Beam(row, 0, Direction.RIGHT));
}
for (let row = 0; row < lines.length; row++) {
    startPositions.push(new Beam(row, lines[0].length - 1, Direction.LEFT));
}
for (let col = 0; col < lines[0].length; col++) {
    startPositions.push(new Beam(lines.length - 1, col, Direction.UP));
}

// find the start position that has the most beams
// use the reduce function to keep track of the max
let max = startPositions.reduce((max, pos) => {
    let count = sendBeam(pos.row, pos.col, pos.direction);
    console.log(`(${pos.row}, ${pos.col}, ${pos.direction}) => ${count}`);
    return Math.max(max, count);
}, 0);
console.log(max);