import { join } from "path";
import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { LavaField } from "./lava";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);
let lines = contents.split("\n");

console.log(`==== ${day}: PART 1 ====`);
let lavaField = new LavaField(lines);
lavaField.digField();
//let total = lavaField.floodFillFrom(1, 1);
//console.log(total);
console.log(lavaField.field.join("\n"));
