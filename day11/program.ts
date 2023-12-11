import exp from "constants";
import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.EASY);

let lines = contents.split("\n");

function expand() {
    // find lines where every char is a "."
    let spaceLine = ".".repeat(lines[0].length);
    let indexes = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line === spaceLine) {
            indexes.push(i + indexes.length);
        }
    }
    // add a spaceline at each index in indexes
    for (let i = 0; i < indexes.length; i++) {
        let index = indexes[i];
        lines.splice(index, 0, spaceLine);
    }

    // find column indexes where every char is a "."
    indexes = [];
    for (let col = 0; col < lines[0].length; col++) {
        let empty = true;
        for (let line of lines) {
            if (line[col] !== ".") {
                empty = false;
                break;
            }
        }
        if (empty) indexes.push(col + indexes.length);
    }

    // add a "." at each index in indexes in each line
    for (let i = 0; i < indexes.length; i++) {
        let index = indexes[i];
        for (let j = 0; j < lines.length; j++) {
            let line = lines[j];
            line = line.slice(0, index) + "." + line.slice(index);
            lines[j] = line;
        }
    }
}

console.log(`==== ${day}: PART 1 ====`);
expand();
console.log(lines.join("\n"));
