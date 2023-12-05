import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Almanac } from "./map";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.EASY);

console.log(`==== ${day}: PART 1 ====`);
let almanac = new Almanac(contents);
let locations = almanac.seeds.map(x => almanac.mapNum(x));
console.log(Math.min(...locations));

console.log(`==== ${day}: PART 2 ====`);
let seedRange = almanac.seedRanges[0];
let min = Number.MAX_SAFE_INTEGER;
for (let i = seedRange.Start; i < seedRange.Start + seedRange.Length; i++) {
    let location = almanac.mapNum(i, "seed", "soil");
    console.log(`${i} -> ${location}`);
    if (location < min) {
        min = location;
    }
}
console.log(min);