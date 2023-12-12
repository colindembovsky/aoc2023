import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

function match(str: string, segmentPattern: number[]): boolean {
    let regex = /#+/g;
    // iterate the matches and check each match to see if it's length matches the corresponding segment
    let match;
    let index = 0;
    // check that the number of segments matches the number of segment patterns
    if (str.match(regex)?.length !== segmentPattern.length) {
        return false;
    }
    while ((match = regex.exec(str)) !== null) {
        if (match[0].length !== segmentPattern[index++]) {
            return false;
        }
    }
    return true;
}

// test
// console.log(match("???.###", [1,1,3]));
// console.log(match("#.#.###", [1,1,3]));
// console.log(match("##..###", [1,1,3]));
// console.log(match(".#.###.#.######", [1,3,1,6]));

function getSolutions(str: string, segmentPattern: number[]): string[] {
    // find the first index of a "?" in the string
    let firstQuestionMarkIndex = str.indexOf("?");
    // if there are none, check the string against the segment pattern
    if (firstQuestionMarkIndex < 0) {
        if (match(str, segmentPattern)) {
            return [ str ];
        }
        return [];
    }
    // otherwise, replace the first instance of "?" with a "#" and a ".", and recurse
    let hashSolutions = getSolutions(str.replace("?", "#"), segmentPattern);
    let dotSolutions = getSolutions(str.replace("?", "."), segmentPattern);
    // return the union of the two solutions and only unique solutions
    return [ ...new Set([ ...hashSolutions, ...dotSolutions ]) ];
}

// test
// console.log(getNumberOfSolutions("???.###", [1,1,3]).length);
// console.log(getNumberOfSolutions(".??..??...?##", [1,1,3]).length);
// console.log(getNumberOfSolutions("?#?#?#?#?#?#?#?", [1,3,1,6]).length);
// console.log(getNumberOfSolutions("????.#...#...", [4,1,1]).length);
// console.log(getNumberOfSolutions("????.######..#####.", [1,6,5]).length);
//getSolutions("?###????????", [3,2,1]).forEach(s => console.log(s));
//console.log(getSolutions("?###????????", [3,2,1]).length);

console.log(`==== ${day}: PART 1 ====`);
let lines = contents.split("\n").map(l => {
    let [ pattern, segmentPattern ] = l.split(" ");
    return { pattern, segmentPattern: segmentPattern.split(",").map(s => parseInt(s)) }
});
// sum the total number of solutions for each line
let sum = lines.reduce((sum, line) => sum + getSolutions(line.pattern, line.segmentPattern).length, 0);
console.log(sum);