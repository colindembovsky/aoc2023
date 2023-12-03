import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Bag, Game } from "./game";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

//console.log(contents);

console.log(`==== ${day}: PART 1 ====`);
let lines = contents.split("\n");
let games = lines.map(line => new Game(line));

// find the ids of all games that have a bag that works for the combo
let workingGames = games.filter(game => game.bags.every(bag => bag.worksForCombo(12, 13, 14)));

// log the sum of game ids
console.log(workingGames.reduce((sum, game) => sum + game.gameNumber, 0));

console.log(`==== ${day}: PART 2 ====`);
// calculate the sum of the power for all games
console.log(games.reduce((sum, game) => sum + game.minCubesPower(), 0));
