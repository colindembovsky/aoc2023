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

Part.lines = lines;
let parts: Part[] = [];
let gears = new Map<string, Part[]>();

lines.forEach((line, row) => {
    let tmpNum = "";
    let isPart = false;
    for (let c = 0; c < line.length; c++) {
        let char = line[c];
        if (char === "*") {
            gears.set(`${row}|${c}`, []);
        }
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

console.log(`==== ${day}: PART 1 ====`);

let realParts = parts.filter(p => p.isPart);
console.log(realParts.reduce((a, b) => a + b.num, 0));

console.log(`==== ${day}: PART 2 ====`);

[...gears.keys()].forEach(key => { 
    console.log(key);
    let [row, col] = key.split("|").map(x => parseInt(x));
    realParts.filter(p => p.isPossibleGearPart(row, col)).forEach(p => gears.get(key)?.push(p));
    //console.log(gears.get(key)?.map(p => p.num));
});

let gearParts = [...gears.values()].filter(x => x.length === 2);
console.log(gearParts.map(x => x[0].num * x[1].num).reduce((a, b) => a + b, 0));