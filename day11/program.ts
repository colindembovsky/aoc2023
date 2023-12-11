import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

let lines = contents.split("\n");

function expand() {
    let spaceLine = ".".repeat(lines[0].length);
    let inserts = 0;
    for (let i = 0; i < emptyRowIndexes.length; i++) {
        let index = emptyRowIndexes[i];
        lines.splice(index + inserts++, 0, spaceLine);
    }

    inserts = 0;
    for (let i = 0; i < emptyColumnIndexes.length; i++) {
        let index = emptyColumnIndexes[i] + inserts++;
        for (let j = 0; j < lines.length; j++) {
            let line = lines[j];
            line = line.slice(0, index) + "." + line.slice(index);
            lines[j] = line;
        }
    }
}

function getEmptyRowIndexes(): number[] {
    let indexes = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.indexOf("#") === -1) {
            indexes.push(i);
        }
    }
    return indexes;
}

function getEmptyColumnIndexes(): number[] {
    let indexes = [];
    for (let col = 0; col < lines[0].length; col++) {
        let empty = true;
        for (let line of lines) {
            if (line[col] !== ".") {
                empty = false;
                break;
            }
        }
        if (empty) indexes.push(col);
    }
    return indexes;
}

function indexesBetween(start: number, end: number, indexes: number[]): number {
    // return the number of indexes between start and end
    let count = 0;
    for (let index of indexes) {
        if (index > start && index < end || index > end && index < start) count++;
    }
    return count * (indexMultiplier - 1);
}

interface Point {
    row: number;
    col: number;
}

function calcManhattanDistExpanded(p1: Point, p2: Point): number {
    let rowDist = Math.abs(p1.row - p2.row);
    let colDist = Math.abs(p1.col - p2.col);
    return rowDist + colDist;
}

function calcManhattanDist(p1: Point, p2: Point): number {
    let rowDist = Math.abs(p1.row - p2.row) + indexesBetween(p1.row, p2.row, emptyRowIndexes);
    let colDist = Math.abs(p1.col - p2.col) + indexesBetween(p1.col, p2.col, emptyColumnIndexes);
    return rowDist + colDist;
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
let emptyRowIndexes = getEmptyRowIndexes();
let emptyColumnIndexes = getEmptyColumnIndexes();
let indexMultiplier = 2;

let galaxies = findGalaxies();
let pairs = getAllGalaxyPairs(galaxies);

let dist = 0;
for (let [p1, p2] of pairs) {
    dist += calcManhattanDist(p1, p2);
}
console.log(dist);

console.log(`==== ${day}: PART 2 ====`);
indexMultiplier = 1000000;
dist = 0;
for (let [p1, p2] of pairs) {
    dist += calcManhattanDist(p1, p2);
}
console.log(dist);
