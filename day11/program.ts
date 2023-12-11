import exp from "constants";
import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { get } from "http";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

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

interface Point {
    row: number;
    col: number;
}

function calcManhattanDist(p1: Point, p2: Point): number {
    return Math.abs(p1.row - p2.row) + Math.abs(p1.col - p2.col);
}

function findGalaxies(): Point[] {
    let galaxies = [];
    for (let row = 0; row < lines.length; row++) {
        let line = lines[row];
        let col = line.indexOf("#");
        while (col !== -1) {
            galaxies.push({ row, col });
            col = line.indexOf("#", col + 1);
        }
    }
    return galaxies;
}

// create combinations of galaxies
function getAllGalaxyPairs(galaxies: Point[]): Point[][] {
    let pairs = [];
    for (let i = 0; i < galaxies.length; i++) {
        let p1 = galaxies[i];
        for (let j = i + 1; j < galaxies.length; j++) {
            let p2 = galaxies[j];
            pairs.push([p1, p2]);
        }
    }
    return pairs;
}

console.log(`==== ${day}: PART 1 ====`);
expand();
let galaxies = findGalaxies();
let pairs = getAllGalaxyPairs(galaxies);
let dist = 0;
for (let [p1, p2] of pairs) {
    dist += calcManhattanDist(p1, p2);
}
console.log(dist);