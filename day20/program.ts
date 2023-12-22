import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Mod, Pulse } from "./module";
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
    let globalState = [...modules.values()].map(m => m.stateString).join("");
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
            if (p.to.name === "rx" && p.pulse === Pulse.Low) {
                console.log(`Found low pulse on rx after ${i} iterations`);
                break;
            }
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
totalHigh = 0;
totalLow = 0;
let i = 0;
while (true) {
    i++;
    let pulsesOnWire = [{ from: "button", to: modules.get("broadcaster")!, pulse: Pulse.Low }];

    while (pulsesOnWire.length > 0) {
        let pulseOnWire = pulsesOnWire.shift()!;
        for (let p of pulseOnWire.to.send(pulseOnWire.from, pulseOnWire.pulse)) {
            if (p.to.name === "rx" && p.pulse === Pulse.Low) {
                console.log(`Found low pulse on rx after ${i} iterations`);
                break;
            }
            pulsesOnWire.push(p);
        }
    }
    if (i % 1000000 === 0) {
        console.log(`${i / 1000000}M iterations`);
    }    
}