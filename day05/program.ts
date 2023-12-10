import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Almanac } from "./map";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.EASY);

console.log(`==== ${day}: PART 1 ====`);
let almanac = new Almanac(contents);
// let locations = almanac.seeds.map(x => almanac.mapNum(x));
// console.log(Math.min(...locations));

console.log(`==== ${day}: PART 2 ====`);
let seedRange = almanac.seedRanges[0];

// create a range from seedRange.Start to seedRange.Start + seedRange.Length using the spread operator
let range = [...Array(seedRange.Length).keys()].map(x => x + seedRange.Start);

let minLocation = range.reduce((prev, cur) => {
    let curLocation = almanac.mapNum(cur, "seed", "location");
    if (curLocation < prev) {
        return curLocation;
    }
    return prev;
}, Number.MAX_SAFE_INTEGER);
console.log(minLocation);