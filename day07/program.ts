import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Hand } from "./hand";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);
let lines = contents.split("\n");
let hands = lines.map(l => new Hand(l));

console.log(`==== ${day}: PART 1 ====`);
// rank the hands
let rankedHands = hands.sort((a, b) => a.compare(b));
rankedHands.forEach((h, i) => console.log(`${i + 1}: ${h.cards} (${h.bid})`));

// sum (index + 1) * bid
let total = rankedHands.reduce((acc, h, i) => acc + (i + 1) * h.bid, 0);
console.log(`Total: ${total}`);