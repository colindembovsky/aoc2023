import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Reading } from "./oasis";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

//console.log(contents);

console.log(`==== ${day}: PART 1 ====`);
let lines = contents.split("\n");
let sum = 0;
lines.forEach(line => {
    let values = line.split(" ").map(v => parseInt(v));
    let reading = new Reading(values);
    let next = reading.predictNextNumber();
    console.log(next);
    sum += next;
});
console.log(sum);

console.log(`==== ${day}: PART 2 ====`);
sum = 0;
lines.forEach(line => {
    let values = line.split(" ").map(v => parseInt(v));
    let reading = new Reading(values);
    let prev = reading.predictPreviousNumber();
    console.log(prev);
    sum += prev;
});
console.log(sum);