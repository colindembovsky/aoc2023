import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Card } from "./card";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

console.log(`==== ${day}: PART 1 ====`);
let lines = contents.split("\n");
let cards = lines.map(x => new Card(x));
let totalPoints = cards.reduce((acc, card) => acc + card.points, 0);

console.log(totalPoints);

console.log(`==== ${day}: PART 2 ====`);
Card.originalCards = cards;
// initialize the map with the card IDs
cards.forEach(x => Card.matchMap.set(x.id, 1));
cards.forEach(x => x.calculateRecursiveWinners());
// sum the values of the map
// print the key:value pairs of the map
console.log(Array.from(Card.matchMap.entries()).map(x => `${x[0]}: ${x[1]}`).join("\n"));
let totalRecursivePoints = Array.from(Card.matchMap.values()).reduce((acc, val) => acc + val, 0);
console.log(totalRecursivePoints);
// 633585 is too low
// 633559 is too low
// 5278062 is too low