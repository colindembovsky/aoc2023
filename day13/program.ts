import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Field } from "./field";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);
let groups = contents.split('\n\n');

console.log(`==== ${day}: PART 1 ====`);
let fields = groups.map(g => new Field(g.split('\n')));
let score = fields.reduce((acc, f) => acc + f.score, 0);
console.log(`Score: ${score}`);

console.log(`==== ${day}: PART 2 ====`);
score = fields.reduce((acc, f) => acc + f.fixSmudge(), 0);
console.log(`Score: ${score}`);