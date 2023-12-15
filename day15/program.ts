import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

let segments = contents.split(",");

function hash(input: string) {
    return input.split("").reduce((acc, char) => {
        let ascii = char.charCodeAt(0);
        return (acc + ascii) * 17 % 256;
    }, 0);
}

console.log(`==== ${day}: PART 1 ====`);
// sum the hash of each segment
let sum = segments.reduce((acc, segment) => acc + hash(segment), 0);
console.log(sum);
