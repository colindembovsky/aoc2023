import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Field } from "./field";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);
let groups = contents.split('\n\n');

console.log(`==== ${day}: PART 1 ====`);
let fields = groups.map(g => new Field(g.split('\n')));
fields.forEach(f => console.log(`${f.horizontalReflectionIndex}, ${f.verticalReflectionIndex}, ${f.score}`));
let score = fields.reduce((acc, f) => acc + f.score, 0);
console.log(`Score: ${score}`);