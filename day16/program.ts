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

interface Route {
    beamId: number;
    row: number;
    col: number;
    direction: Direction;
}

function followBeam(route: Route): Route[] {
    if (route.row < 0 || route.row >= lines.length || route.col < 0 || route.col >= lines[0].length) return [];
    let tile = lines[route.row][route.col];
    let key = `${route.row},${route.col}`;
    let beams = map.get(key) ?? [];
    // the beam has already been here, so we can stop
    if (beams.includes(route.beamId)) return [];

    // mark this beam as having been here
    beams.push(route.beamId);
    map.set(key, beams);

    switch (tile) {
        case ".": {
            switch(route.direction) {
                case Direction.UP:
                    return [{ beamId: route.beamId, row: route.row - 1, col: route.col, direction: route.direction}];
                case Direction.DOWN:
                    return [{ beamId: route.beamId, row: route.row + 1, col: route.col, direction: route.direction}];
                case Direction.LEFT:
                    return [{ beamId: route.beamId, row: route.row, col: route.col - 1, direction: route.direction}];
                case Direction.RIGHT:
                    return [{ beamId: route.beamId, row: route.row, col: route.col + 1, direction: route.direction}];
            }
        }
        case "/": {
            switch(route.direction) {
                case Direction.UP:
                    return [ { beamId: route.beamId, row: route.row, col: route.col + 1, direction: Direction.RIGHT }];
                case Direction.DOWN:
                    return [ { beamId: route.beamId, row: route.row, col: route.col - 1, direction: Direction.LEFT }];
                case Direction.LEFT:
                    return [ { beamId: route.beamId, row: route.row + 1, col: route.col, direction: Direction.DOWN }];
                case Direction.RIGHT:
                    return [ { beamId: route.beamId, row: route.row - 1, col: route.col, direction: Direction.UP }];
            }
        }
        case "\\": {
            switch(route.direction) {
                case Direction.UP:
                    return [ { beamId: route.beamId, row: route.row, col: route.col - 1, direction: Direction.LEFT }];
                case Direction.DOWN:
                    return [ { beamId: route.beamId, row: route.row, col: route.col + 1, direction: Direction.RIGHT }];
                case Direction.LEFT:
                    return [ { beamId: route.beamId, row: route.row - 1, col: route.col, direction: Direction.UP }];
                case Direction.RIGHT:
                    return [ { beamId: route.beamId, row: route.row + 1, col: route.col, direction: Direction.DOWN }];
            }
        }
        case "-": {
            switch(route.direction) {
                case Direction.UP:
                case Direction.DOWN:
                {
                    let res = [
                        { beamId: route.beamId + 1, row: route.row, col: route.col + 1, direction: Direction.RIGHT },
                        { beamId: route.beamId + 1, row: route.row, col: route.col - 1, direction: Direction.LEFT }
                    ];
                    beams.push(route.beamId + 1);
                    map.set(key, beams);
                    return res;
                }
                case Direction.LEFT: return [{ beamId: route.beamId, row: route.row, col: route.col - 1, direction: route.direction }];
                case Direction.RIGHT: return [{ beamId: route.beamId, row: route.row, col: route.col + 1, direction: route.direction }];
                    
            }
        }
        case "|": {
            switch(route.direction) {
                case Direction.UP: return [{ beamId: route.beamId, row: route.row - 1, col: route.col, direction: route.direction }];
                case Direction.DOWN: return [{ beamId: route.beamId, row: route.row + 1, col: route.col, direction: route.direction }];
                case Direction.LEFT:
                case Direction.RIGHT:
                {
                    let res = [
                        { beamId: route.beamId + 1, row: route.row + 1, col: route.col, direction: Direction.DOWN },
                        { beamId: route.beamId + 1, row: route.row - 1, col: route.col, direction: Direction.UP }
                    ];
                    beams.push(route.beamId + 1);
                    map.set(key, beams);
                    return res;
                }
            }
        }
    }
    throw new Error(`Unknown tile ${tile}`);
}

console.log(`==== ${day}: PART 1 ====`);
let map = new Map<string, number[]>();
let stack: Route[] = [{ beamId:0, row: 0, col: 0, direction: Direction.RIGHT }];
while (stack.length > 0) {
    let route = stack.pop()!;
    let routes = followBeam(route);
    stack.push(...routes);
}
console.log(map.size);