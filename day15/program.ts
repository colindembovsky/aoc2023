import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Box, Op, OpType } from "./box";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

let segments = contents.split(",");

function hash(input: string): number {
    return input.split("").reduce((acc, char) => {
        let ascii = char.charCodeAt(0);
        return (acc + ascii) * 17 % 256;
    }, 0);
}

console.log(`==== ${day}: PART 1 ====`);
// sum the hash of each segment
let sum = segments.reduce((acc, segment) => acc + hash(segment), 0);
console.log(sum);

console.log(`==== ${day}: PART 2 ====`);
let map = new Map<number, Box>();
segments.forEach(s => {
    let op = Box.getOp(s);
    let boxId = hash(op.label);

    let box = map.get(boxId);
    if (box === undefined) {
        box = new Box(boxId);
        map.set(boxId, box);
    }
    box.performOp(op);
});
let boxes = Array.from(map.values());
sum = boxes.reduce((acc, box) => acc + box.lensPower, 0);
console.log(sum);