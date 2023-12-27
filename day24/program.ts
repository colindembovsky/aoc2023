import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { getLine, linesCrossInXYOnVector } from "./hailstone";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);
let lines = contents.split("\n");

console.log(`==== ${day}: PART 1 ====`);
let stones = lines.map(line => getLine(line));
// create pairs of each of the stones
let pairs = [];
for (let i = 0; i < stones.length; i++) {
    for (let j = i+1; j < stones.length; j++) {
        pairs.push([stones[i], stones[j]]);
    }
}

let intersections = [];
let min = 200000000000000,
    max = 400000000000000;
pairs.forEach(p => {
    let [l1, l2] = p;
    let intersection = linesCrossInXYOnVector(l1, l2);
    if (intersection && intersection.x > min && intersection.x < max && intersection.y > min && intersection.y < max) {
        intersections.push(intersection);
    }
});
console.log(intersections.length);