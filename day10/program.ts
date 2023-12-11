import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

let test1 = `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`;
//contents = test1;

let lines = contents.split("\n");

enum Direction {
    North,
    East,
    South,
    West
}

function findStart() : [number, number] {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let col = line.indexOf("S");
        if (col !== -1) {
            return [i, col];
        }
    }
    throw new Error("No start found!");
}

function getLetter(row: number, col: number) : string {
    let line = lines[row];
    return line[col];
}

function moveToNewPosAndDirection() {
    switch (curLetter) {
        case "|": {
            if (facing === Direction.North) {
                curRow--;
            } else if (facing === Direction.South) {
                curRow++;
            } else {
                throw new Error("Invalid direction!");
            }
            break;
        }
        case "-": {
            if (facing === Direction.East) {
                curCol++;
            } else if (facing === Direction.West) {
                curCol--;
            } else {
                throw new Error("Invalid direction!");
            }
            break;
        }
        case "F": {
            if (facing === Direction.North) {
                curCol++;
                facing = Direction.East;
            } else if (facing === Direction.West) {
                curRow++;
                facing = Direction.South;
            } else {
                throw new Error("Invalid direction!");
            }
            break;
        }
        case "7": {
            if (facing === Direction.North) {
                curCol--;
                facing = Direction.West;
            } else if (facing === Direction.East) {
                curRow++;
                facing = Direction.South;
            } else {
                throw new Error("Invalid direction!");
            }
            break;
        }
        case "J": {
            if (facing === Direction.South) {
                curCol--;
                facing = Direction.West;
            } else if (facing === Direction.East) {
                curRow--;
                facing = Direction.North;
            } else {
                throw new Error("Invalid direction!");
            }
            break;
        }
        case "L": {
            if (facing === Direction.South) {
                curCol++;
                facing = Direction.East;
            } else if (facing === Direction.West) {
                curRow--;
                facing = Direction.North;
            } else {
                throw new Error("Invalid direction!");
            }
            break;
        }
        default: {
            throw new Error("Invalid direction!");
        }
    }
    curLetter = getLetter(curRow, curCol);
    console.log(`${curLetter} > ${Direction[facing]}`);
}

console.log(`==== ${day}: PART 1 ====`);
let [curRow, curCol] = findStart();
//let curLetter = "F"; // easy
let curLetter = "-"; // hard
let facing = Direction.West;

let count = 1;
moveToNewPosAndDirection();
while(curLetter !== "S") {
    moveToNewPosAndDirection();
    count++;
}
console.log(count/2);