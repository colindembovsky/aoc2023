import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.EASY);

enum Type {
    Junk,
    Inside,
    Wall,
}

let areaTracker : Type[][] = [];

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
    areaTracker[curRow][curCol] = Type.Wall;
    console.log(`${curLetter} > ${Direction[facing]}`);
}

console.log(`==== ${day}: PART 1 ====`);
// initialize the area track setting every cell to Junk
areaTracker = Array.from({length: lines.length}, () => Array.from({length: lines[0].length}, () => Type.Junk));
let [curRow, curCol] = findStart();
areaTracker[curRow][curCol] = Type.Wall;

let curLetter = "F"; // easy
//let curLetter = "-"; // hard
let facing = Direction.West;
let count = 1;
moveToNewPosAndDirection();
while(curLetter !== "S") {
    moveToNewPosAndDirection();
    count++;
}
console.log(count/2);

console.log(`==== ${day}: PART 2 ====`);

function floodFill(x: number, y: number) {
    if (x < 0 || y < 0 || x >= areaTracker.length || y >= areaTracker[0].length) {
        return;
    }
    if (areaTracker[x][y] !== Type.Junk) {
        return;
    }

    areaTracker[x][y] = Type.Inside;

    floodFill(x - 1, y);
    floodFill(x + 1, y);
    floodFill(x, y - 1);
    floodFill(x, y + 1);
}

// Call floodFill from all 4 corners
if (areaTracker[0][0] !== Type.Wall) {
    floodFill(0, 0);
}
if (areaTracker[0][areaTracker[0].length - 1] !== Type.Wall) {
    floodFill(0, areaTracker[0].length - 1);
}
// if (areaTracker[areaTracker.length - 1][0] !== Type.Wall) {
//     floodFill(areaTracker.length - 1, 0);
// }
// if (areaTracker[areaTracker.length - 1][areaTracker[0].length - 1] !== Type.Wall) {
//     floodFill(areaTracker.length - 1, areaTracker[0].length - 1);
// }

// count the number of cells that are inside
let insideCount = 0;
for (let i = 0; i < areaTracker.length; i++) {
    for (let j = 0; j < areaTracker[0].length; j++) {
        if (areaTracker[i][j] === Type.Inside) {
            insideCount++;
        }
    }
}
console.log(insideCount);