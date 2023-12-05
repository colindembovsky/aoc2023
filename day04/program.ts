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
totalPoints = cards.length;
cards.forEach(card => {
    let points = card.calculateCopies();
    console.log(`Card ${card.id} has ${points} points`);
    totalPoints += points;
});
console.log(`Total: ${totalPoints}`);