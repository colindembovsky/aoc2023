import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { NodeMap } from "./mapEntry";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

// let contents2 = `LLR

// AAA = (BBB, BBB)
// BBB = (AAA, ZZZ)
// ZZZ = (ZZZ, ZZZ)`;

console.log(`==== ${day}: PART 1 ====`);
let lines = contents.split("\n");
let instructions = lines.shift()!;
lines.shift(); // empty line
let map = new NodeMap(instructions, lines);
console.log(map.countStepsInInstructions());


