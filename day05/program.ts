import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Almanac } from "./map";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

console.log(contents);

console.log(`==== ${day}: PART 1 ====`);
let almanac = new Almanac(contents);
let locations = almanac.seeds.map(x => almanac.getLocationForSeed(x));
console.log(locations);
console.log(Math.min(...locations));
