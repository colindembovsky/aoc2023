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

console.log(`==== ${day}: PART 1 ====`);
let map = new Map<string, Beam[]>();
let stack: Beam[] = [new Beam(0, 0, Direction.RIGHT)];
while (stack.length > 0) {
    let route = stack.shift()!;
    let routes = followBeam(route);
    stack.push(...routes);
}
console.log(map.size);

console.log(`==== ${day}: PART 2 ====`);
