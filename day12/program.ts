import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

function match(str: string, segmentPattern: number[]): boolean {
    let regex = /#+/g;
    let match;
    let index = 0;
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

function getSolutions(str: string, segmentPattern: number[]): string[] {
    let firstQuestionMarkIndex = str.indexOf("?");
    if (firstQuestionMarkIndex < 0) {
        if (match(str, segmentPattern)) {
            return [ str ];
        }
        return [];
    }
    let hashSolutions = getSolutions(str.replace("?", "#"), segmentPattern);
    let dotSolutions = getSolutions(str.replace("?", "."), segmentPattern);
    return [ ...new Set([ ...hashSolutions, ...dotSolutions ]) ];
}

console.log(`==== ${day}: PART 1 ====`);
let lines = contents.split("\n").map(l => {
    let [ pattern, segmentPattern ] = l.split(" ");
    return { pattern, segmentPattern: segmentPattern.split(",").map(s => parseInt(s)) }
});
let sum = lines.reduce((sum, line) => sum + getSolutions(line.pattern, line.segmentPattern).length, 0);
console.log(sum);