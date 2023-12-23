import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { lcm } from "../utils/mathUtils";
import { Mod, Pulse  } from "./module";
import * as crypto from "crypto";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);
// contents = `broadcaster -> a, b, c
// %a -> b
// %b -> c
// %c -> inv
// &inv -> a`;
let lines = contents.split("\n");

console.log(`==== ${day}: PART 1 ====`);
let modules = Mod.parseModules(lines);

function getHash() {
    let hash = crypto.createHash("md5");
    let globalState = [...modules.values()].map(m => m.stateString).join("|");
    hash.update(globalState);
    return hash.digest("hex");
}

let totalHigh = 0;
let totalLow = 0;
let stateCache = new Set<string>();
for (let i = 0; i < 1000; i++) {
    let cacheKey = getHash();
    if (stateCache.has(cacheKey)) {
        break;
    }

    let pulsesOnWire = [{ from: "button", to: modules.get("broadcaster")!, pulse: Pulse.Low }];
    let high = 0;
    let low = 1;

    while (pulsesOnWire.length > 0) {
        let pulseOnWire = pulsesOnWire.shift()!;
        //console.log(`${pulseOnWire.from} -${Pulse[pulseOnWire.pulse]}-> ${pulseOnWire.to.name}`);
        for (let p of pulseOnWire.to.send(pulseOnWire.from, pulseOnWire.pulse)) {
            pulsesOnWire.push(p);
            if (p.pulse === Pulse.High) {
                high++;
            } else {
                low++;
            }
        }
    }
    // console.log(`${i}: Total High: ${high}, Total Low: ${low}`);
    // console.log("====================================");
    stateCache.add(cacheKey);
    totalHigh += high;
    totalLow += low;
}
let multiplier = 1000 / stateCache.size;
console.log(`Ran ${stateCache.size} states`);
console.log(`Total High: ${totalHigh}, Total Low: ${totalLow}`);
console.log(`Multiplier: ${multiplier}`);
console.log(`Answer: ${totalHigh * totalLow * multiplier * multiplier}`);

console.log(`==== ${day}: PART 2 ====`);
modules = Mod.parseModules(lines);
let rgMod = modules.get("rg")!; // this is the input to rx
let map = new Map<string, number>();
// each input to rg must be high for it to send a low to rx
[...rgMod.inputMap.keys()].forEach(k => map.set(k, 0));

let i = 0;
while(true) {
    i++;
    if (i % 10000 === 0) console.log(`Iteration ${i / 1000000}M`);
    let pulsesOnWire = [{ from: "button", to: modules.get("broadcaster")!, pulse: Pulse.Low }];
    while (pulsesOnWire.length > 0) {
        let pulseOnWire = pulsesOnWire.shift()!;
        for (let p of pulseOnWire.to.send(pulseOnWire.from, pulseOnWire.pulse)) {
            pulsesOnWire.push(p);
            if (p.pulse === Pulse.High && map.has(p.from)) {
                map.set(p.from, i);
            }
        }
    }

    if ([...map.values()].every(v => v !== 0)) {
        break;
    }
}

[...map.entries()].forEach(([k, v]) => console.log(`${k}: ${v}`));
let nums = [...map.values()].map(v => v);
let result = lcm(nums);
console.log(`Button presses needed: ${result}`);