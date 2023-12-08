import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Part } from "./part";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

let otherInput = `12.......*..
+.........34
.......-12..
..78........
..*....60...
78..........
.......23...
....90*12...
............
2.2......12.
.*.........*
1.1.......56`;
//contents = otherInput; // should result in 413|6756

//console.log(contents);
let lines = contents.split("\n");

console.log(`==== ${day}: PART 1 ====`);

Part.lines = lines;
let parts: Part[] = [];
lines.forEach((line, row) => {
    let tmpNum = "";
    let isPart = false;
    for (let c = 0; c < line.length; c++) {
        let char = line[c];
        if (char.match(/\d/)) {
            tmpNum += char;
            isPart ||= Part.touchesSymbol(row, c);
            if (c === line.length - 1) {
                parts.push(new Part(row, c - tmpNum.length, parseInt(tmpNum), isPart));
                tmpNum = "";
                isPart = false;
            }
        } else {
            if (tmpNum.length > 0) {
                parts.push(new Part(row, c - tmpNum.length, parseInt(tmpNum), isPart));
                tmpNum = "";
                isPart = false;
            }
        }
    }
});

//partNums.forEach(num => console.log(num));
parts.filter(p => p.isPart).forEach(p => console.log(p.num));
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
// not 532422
// gosh - 535235