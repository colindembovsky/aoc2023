import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Hand } from "./hand";
import { Hand2 } from "./hand2";

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

console.log(`==== ${day}: PART 2 ====`);
let hands2 = lines.map(l => new Hand2(l));
let rankedHands2 = hands2.sort((a, b) => a.compare(b));
rankedHands2.forEach((h, i) => console.log(`${i + 1}: ${h.cards} (${h.bid})`));

// sum (index + 1) * bid
let total2 = rankedHands2.reduce((acc, h, i) => acc + (i + 1) * h.bid, 0);
console.log(`Total: ${total2}`);