import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import * as crypto from "crypto";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);
let lines = contents.split("\n");

console.log(`==== ${day}: PART 1 ====`);

function rollRockNorth(row: number, col: number) {
    for (let target = row - 1; target >= 0; target--) {
        if (lines[target][col] === "#" || lines[target][col] === "O") {
            return;
        }
        lines[target] = lines[target].substring(0, col) + "O" + lines[target].substring(col + 1);
        lines[target + 1] = lines[target + 1].substring(0, col) + "." + lines[target + 1].substring(col + 1);
    }
}

function rollRockSouth(row: number, col: number) {
    for (let target = row + 1; target < lines.length; target++) {
        if (lines[target][col] === "#" || lines[target][col] === "O") {
            return;
        }
        lines[target] = lines[target].substring(0, col) + "O" + lines[target].substring(col + 1);
        lines[target - 1] = lines[target - 1].substring(0, col) + "." + lines[target - 1].substring(col + 1);
    }
}

function rollRockEast(row: number, col: number) {
    for (let target = col + 1; target < lines[row].length; target++) {
        if (lines[row][target] === "#" || lines[row][target] === "O") {
            return;
        }
        lines[row] = lines[row].substring(0, target) + "O" + lines[row].substring(target + 1);
        lines[row] = lines[row].substring(0, target - 1) + "." + lines[row].substring(target);
    }
}

function rollRockWest(row: number, col: number) {
    for (let target = col - 1; target >= 0; target--) {
        if (lines[row][target] === "#" || lines[row][target] === "O") {
            return;
        }
        lines[row] = lines[row].substring(0, target) + "O" + lines[row].substring(target + 1);
        lines[row] = lines[row].substring(0, target + 1) + "." + lines[row].substring(target + 2);
    }
}

function score() {
    let score = 0;
    for (let row = 0; row < lines.length; row++) {
        let rocks = lines[row].split("").filter(c => c === "O").length;
        score += rocks * (lines.length - row);
    }
    return score;
}

function rollAllNorth() {
    for (let col = 0; col < lines[0].length; col++) {
        for (let curRow = 0; curRow < lines.length; curRow++) {
            if (lines[curRow][col] === "O") {
                rollRockNorth(curRow, col);
            }
        }
    }
}

function rollAllSouth() {
    for (let col = 0; col < lines[0].length; col++) {
        for (let curRow = lines.length - 1; curRow >= 0; curRow--) {
            if (lines[curRow][col] === "O") {
                rollRockSouth(curRow, col);
            }
        }
    }
}

function rollAllEast() {
    for (let row = 0; row < lines.length; row++) {
        for (let curCol = lines[row].length - 1; curCol >= 0; curCol--) {
            if (lines[row][curCol] === "O") {
                rollRockEast(row, curCol);
            }
        }
    }
}

function rollAllWest() {
    for (let row = 0; row < lines.length; row++) {
        for (let curCol = 0; curCol < lines[row].length; curCol++) {
            if (lines[row][curCol] === "O") {
                rollRockWest(row, curCol);
            }
        }
    }
}

function rollCycle() {
    rollAllNorth();
    rollAllWest();
    rollAllSouth();
    rollAllEast();

    let hash = crypto.createHash("md5");
    hash.update(lines.join(""));
    return hash.digest("hex");
}

let hashMap = new Map<string, number>();
let targetCycle = 1000000000;

let cycleCount = 0;
let cycleStart = 0;
let cycleLength = 0;
while (cycleCount < targetCycle) {
    let hash = rollCycle();
    cycleCount++;
    if (cycleCount % 100 === 0) {
        console.log(`${cycleCount}`);
    }
    if (hashMap.has(hash)) {
        console.log("Found repeating pattern!");
        cycleStart = hashMap.get(hash)!;
        cycleLength = cycleCount - cycleStart;
        console.log(`Cycle length: ${cycleLength}`);
        break;
    }
    hashMap.set(hash, cycleCount);
}

let remaining = (targetCycle - cycleCount) % cycleLength;
console.log(`Remaining: ${remaining}`);
for (let i = 0; i < remaining; i++) {
    rollCycle();
}
console.log(score());