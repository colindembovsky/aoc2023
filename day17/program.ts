import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { PathFinder } from "./pathfinder";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

console.log(`==== ${day}: PART 1 ====`);
let lines = contents.split('\n');
let pathFinder = new PathFinder(lines);
let heatLoss = pathFinder.findRoute();
console.log(`Heat loss: ${heatLoss}`);