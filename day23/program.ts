import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { CharMap, Position, Direction } from "../utils/mapUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);
let lines = contents.split("\n");

let forest = new CharMap(lines);
let start = new Position(0, 1);
let end = new Position(forest.height - 1, forest.width - 2);

interface Path { 
    position: Position;
    direction: Direction;
    steps: number;
}

console.log(`==== ${day}: PART 1 ====`);
let queue: Path[] = [{position: start, direction: Direction.down, steps: 0}];
let maxPathLength = 0;
while (queue.length > 0) {
    let path = queue.pop()!;
    if (path.position.equals(end)) {
        if (path.steps > maxPathLength) {
            maxPathLength = path.steps;
        }
        continue;
    }
    let nextPossible = [
        path.position.move(path.direction),
        path.position.move(path.direction.turnLeft()),
        path.position.move(path.direction.turnRight())
    ].filter(p => forest.get(p) === '.' ||
        (forest.get(p) === "^" && p.directionFrom(path.position).equals(Direction.up) ||
        (forest.get(p) === "v" && p.directionFrom(path.position).equals(Direction.down)) ||
        (forest.get(p) === "<" && p.directionFrom(path.position).equals(Direction.left)) ||
        (forest.get(p) === ">" && p.directionFrom(path.position).equals(Direction.right))));
    for (let next of nextPossible) {
        queue.push({position: next, direction: next.directionFrom(path.position), steps: path.steps + 1});
    }
}
console.log(maxPathLength);