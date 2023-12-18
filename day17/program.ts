import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { PathFinder } from "./pathfinder";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.EASY);

console.log(`==== ${day}: PART 1 ====`);
let lines = contents.split('\n');
let startHeatLoss = parseInt(lines[0][0]);
let pathFinder = new PathFinder(lines, startHeatLoss);
console.log(pathFinder.findSmallestHeatLossPath());
// 1292 is too high