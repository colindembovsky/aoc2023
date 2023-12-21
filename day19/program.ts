import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Factory } from "./xmas";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

console.log(`==== ${day}: PART 1 ====`);
let factory = new Factory(contents);
console.log(factory.total);