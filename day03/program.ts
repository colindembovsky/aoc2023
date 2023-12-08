import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Part } from "./part";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

//console.log(contents);
let lines = contents.split("\n");

console.log(`==== ${day}: PART 1 ====`);

Part.lines = lines;
let parts: Part[] = [];
lines.forEach((line, row) => {
    // get all the numbers in the line
    let nums = line.match(/\d+/g);

    // for each number, create a part using it's line number, it's position in the line, and the number itself
    let beforePos = new Map<number, number>();
    nums?.forEach(num => {
        let col = line.indexOf(num, beforePos.get(line.indexOf(num)) ?? 0);
        let intNum = parseInt(num);
        beforePos.set(col, intNum);

        parts.push(new Part(row, col, intNum));
    });
});

//partNums.forEach(num => console.log(num));
//parts.filter(p => !p.isPart).sort((a, b) => a.num - b.num).forEach(p => console.log(p.num));
console.log(parts.filter(p => p.isPart).reduce((a, b) => a + b.num, 0));
// not 330727 (unique numbers)
// not 535294 (duplicate numbers - but 579 appears once as a part, once as _not_ a part, 988 appears twice etc.)
// not 539102
// not 538006
// not 332375
// not 525938
// not 523875
// not 517228
//532654