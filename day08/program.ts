import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { lcm } from "../utils/mathUtils";
import { NodeMap } from "./mapEntry";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

// let contents2 = `LLR

// AAA = (BBB, BBB)
// BBB = (AAA, ZZZ)
// ZZZ = (ZZZ, ZZZ)`;

// let contents3 = `LR

// 11A = (11B, XXX)
// 11B = (XXX, 11Z)
// 11Z = (11B, XXX)
// 22A = (22B, XXX)
// 22B = (22C, 22C)
// 22C = (22Z, 22Z)
// 22Z = (22B, 22B)
// XXX = (XXX, XXX)`;

console.log(`==== ${day}: PART 1 ====`);
let lines = contents.split("\n");
let instructions = lines.shift()!;
lines.shift(); // empty line
NodeMap.instructions = instructions;
NodeMap.parseMap(lines);

let map = new NodeMap("AAA");
//console.log(map.countStepsInInstructions());

console.log(`==== ${day}: PART 2 ====`);
// find all nodes that end with "A"
let nodes = [...NodeMap.nMap.keys()].filter(k => k.endsWith("A"));
let maps = nodes.map(n => new NodeMap(n));

// while (true) {
//     maps.forEach(m => m.next());
//     NodeMap.curStep++;
//     if (maps.every(m => m.curPos.endsWith("Z"))) break;
//     if (NodeMap.curStep % 1000000 === 0) console.log(NodeMap.curStep);
// }
// console.log(NodeMap.curStep);

let nums: number[] = [];
maps.forEach(m => {
    let n = m.countStepsToTargetWithZ();
    nums = nums.concat(n);
});

console.log(lcm(nums));