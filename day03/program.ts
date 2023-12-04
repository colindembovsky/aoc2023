import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

//console.log(contents);
let lines = contents.split("\n");

console.log(`==== ${day}: PART 1 ====`);
let nums = lines.map(line => {
    // regex to find the numbers in the line
    let match = line.match(/(\d+)/g);
    if (match) {
        // return an array of matching strings
        return match.map(num => num);
    }
    return [];
});

let partNums = Array<string>();
for(let i = 0; i < lines.length; i++) {
    let lineNums = nums[i];
    let line = lines[i];
    
    for(let num of lineNums) {
        let startIndex = line.indexOf(num);
        let lhs = 1;
        if (startIndex === 0) {
            lhs = 0;
        }
        let rhs = 1;
        if (startIndex + num.length === line.length - 1) {
            rhs = 0;
        }

        let dotLine = ".".repeat(num.length + lhs + rhs);
        let start = startIndex - lhs;
        let end = startIndex + num.length + rhs;

        let lineUp = i === 0 ? dotLine : lines[i - 1].substring(start, end);
        let lineIn = line.substring(start, end).replace(num, ".".repeat(num.length));
        let lineDown = i === lines.length - 1 ? dotLine : lines[i + 1].substring(start, end);

        if (lineUp !== dotLine || lineIn !== dotLine || lineDown !== dotLine) {
            partNums.push(num);
        }
    }
}

//partNums.forEach(num => console.log(num));
// get an array of unique numbers using a set
//let uniqueNums = Array.from(new Set(partNums));

console.log(partNums.reduce((a, b) => a + parseInt(b), 0));
// not 330727 (unique numbers)
// not 535294 (duplicate numbers - but 579 appears once as a part, once as _not_ a part, 988 appears twice etc.)
// not 539102
// not 538006
// not 332375