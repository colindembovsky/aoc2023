import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.EASY);
let lines = contents.split("\n");

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
};

function followBeam(row: number, col: number, direction: Direction) {
    if (row < 0 || row >= lines.length || col < 0 || col >= lines[0].length) return;
    let tile = lines[row][col];
    let key = `${row},${col}`;
    let energy = map.get(key) ?? 0;
    switch (tile) {
        case ".": {
            map.set(key, energy + 1);
            switch(direction) {
                case Direction.UP:
                    followBeam(row - 1, col, direction); break;
                case Direction.DOWN:
                    followBeam(row + 1, col, direction); break;
                case Direction.LEFT:
                    followBeam(row, col - 1, direction); break;
                case Direction.RIGHT:
                    followBeam(row, col + 1, direction); break;
            }
        }
        case "/": {
            map.set(key, energy + 1);
            switch(direction) {
                case Direction.UP:
                    followBeam(row, col + 1, Direction.RIGHT); break;
                case Direction.DOWN:
                    followBeam(row, col - 1, Direction.LEFT); break;
                case Direction.LEFT:
                    followBeam(row + 1, col, Direction.DOWN); break;
                case Direction.RIGHT:
                    followBeam(row - 1, col, Direction.UP); break;
            }
        }
        case "\\": {
            map.set(key, energy + 1);
            switch(direction) {
                case Direction.UP:
                    followBeam(row, col - 1, Direction.LEFT); break;
                case Direction.DOWN:
                    followBeam(row, col + 1, Direction.RIGHT); break;
                case Direction.LEFT:
                    followBeam(row - 1, col, Direction.UP); break;
                case Direction.RIGHT:
                    followBeam(row + 1, col, Direction.DOWN); break;
            }
        }
        case "-": {
            map.set(key, energy + 1);
            switch(direction) {
                case Direction.UP:
                case Direction.DOWN:
                {
                    followBeam(row, col + 1, Direction.RIGHT);
                    followBeam(row, col - 1, Direction.LEFT);
                    break;
                }
                case Direction.LEFT: followBeam(row, col - 1, direction); break;
                case Direction.RIGHT: followBeam(row, col + 1, direction); break;
                    
            }
        }
        case "|": {
            map.set(key, energy + 1);
            switch(direction) {
                case Direction.UP: followBeam(row - 1, col, direction); break;
                case Direction.DOWN: followBeam(row + 1, col, direction); break;
                case Direction.LEFT:
                case Direction.RIGHT:
                {
                    followBeam(row + 1, col, Direction.DOWN);
                    followBeam(row - 1, col, Direction.UP);
                    break;
                }
            }
        }
    }
}

console.log(`==== ${day}: PART 1 ====`);
let map = new Map<string, number>();
followBeam(0, 0, Direction.RIGHT);
console.log(map.size);