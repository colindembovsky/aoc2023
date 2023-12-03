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
        let isPart = false;
        let startIndex = line.indexOf(num);
        let endIndex = startIndex + num.length - 1;

        // check if the preceding char is a symbol
        if (startIndex > 0 && line[startIndex-1] !== ".") {
            isPart = true;
        }
        // check if the following char is a .
        if (endIndex < line.length-1 && line[endIndex+1] !== ".") {
            isPart = true;
        }

        // check if the preceding line has . from 1 less than the same index to 1 more than the last index
        if (i > 0) {
            let prevLine = lines[i-1];
            for(let j = Math.max(0, startIndex-1); j <= Math.min(endIndex+1, line.length-1); j++) {
                if (prevLine[j] !== ".") {
                    isPart = true;
                    break;
                }
            }
        }

        // check if the next line has . from 1 less than the same index to 1 more than the last index
        if (!isPart && i < lines.length - 1) {
            let nextLine = lines[i+1];
            for(let j = Math.max(0, startIndex-1); j <= Math.min(endIndex+1, line.length-1); j++) {
                if (nextLine[j] !== ".") {
                    isPart = true;
                    break;
                }
            }
        }
        if (isPart) {
            partNums.push(num);
        }
    }
}

partNums.forEach(num => console.log(num));
console.log(partNums.reduce((a, b) => a + parseInt(b), 0));
// not 330727 (unique numbers)
// not 535294 (duplicate numbers - but 579 appears once as a part, once as _not_ a part, 988 appears twice etc.)