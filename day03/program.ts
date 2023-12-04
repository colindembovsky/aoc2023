import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

//console.log(contents);
let lines = contents.split("\n");

console.log(`==== ${day}: PART 1 ====`);

// add a dot to the start and end of each line
lines = lines.map(line => `.${line}.`);

// add a line of dots to the start and end of the array
lines.unshift(".".repeat(lines[0].length));
lines.push(".".repeat(lines[0].length));

let nums = lines.map(line => {
    // regex to find the numbers in the line
    let match = line.match(/(\d+)/g);
    // return an array of strings for all the matches in this line
    return match ? match : [];
});

let partNums = Array<string>();
let nonParts = Array<string>();
for(let i = 1; i < lines.length - 1; i++) {
    let lineNums = nums[i];
    if (lineNums.length === 0) {
        continue;
    }
    let line = lines[i];
    
    for(let num of lineNums) {
        let startIndex = line.indexOf(num) - 1;
        let endIndex = startIndex + num.length + 2;

        let dotLine = ".".repeat(num.length + 2);
        
        let lineUp = lines[i - 1].substring(startIndex, endIndex);
        let lineIn = line.substring(startIndex, endIndex).replace(num, ".".repeat(num.length));
        let lineDown = lines[i + 1].substring(startIndex, endIndex);

        // console.log("num: " + num);
        // console.log(`${lineUp}\n${lineIn}\n${lineDown}\n`);
        // console.log(" ");

        if (lineUp !== dotLine || lineIn !== dotLine || lineDown !== dotLine) {
            partNums.push(num);
        } else {
            nonParts.push(num);
        }
    }
}

console.log(`partNums: ${partNums.length}`);
console.log(`nonParts: ${nonParts.length}`);
nonParts.forEach(num => console.log(num));
console.log(`total: ${partNums.length + nonParts.length}`);

//partNums.forEach(num => console.log(num));
console.log(partNums.reduce((a, b) => a + parseInt(b), 0));
// not 330727 (unique numbers)
// not 535294 (duplicate numbers - but 579 appears once as a part, once as _not_ a part, 988 appears twice etc.)
// not 539102
// not 538006
// not 332375