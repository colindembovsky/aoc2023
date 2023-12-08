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
    let nums = line.match(/\b\d+\b/g);

    // for each number, create a part using its line number, its position in the line, and the number itself
    nums?.forEach(num => {
        let regex = new RegExp(`\\b${num}\\b`, 'g');
        let match;

        // find all instances of num in the line
        while ((match = regex.exec(line)) !== null) {
            let col = match.index;
            let intNum = parseInt(num);
            parts.push(new Part(row, col, intNum));
        }
    });
});

//partNums.forEach(num => console.log(num));
parts.filter(p => !p.isPart).sort((a, b) => a.num - b.num).forEach(p => console.log(p.num));
console.log(parts.filter(p => p.isPart).reduce((a, b) => a + b.num, 0));
// not 330727 (unique numbers)
// not 535294 (duplicate numbers - but 579 appears once as a part, once as _not_ a part, 988 appears twice etc.)
// not 539102
// not 538006
// not 332375
// not 525938
// not 523875
// not 517228
// not 532654
// not 535251
// not 540073