import { loadInput, dayName, Difficulty } from "../utils/readUtils";
import { Mod, Pulse } from "./module";
import * as crypto from "crypto";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.EASY);
let lines = contents.split("\n");

console.log(`==== ${day}: PART 1 ====`);
let modules = Mod.parseModules(lines);

function getHash(modules: Mod[]) {
    let hash = crypto.createHash("md5");
    let globalState = modules.map(m => m.stateString).join("");
    hash.update(globalState);
    return hash.digest("hex");
}

// press the button 1000 times
let totalHigh = 0;
let totalLow = 0;
let stateCache = new Map<string, number[]>();
for (let i = 0; i < 1000; i++) {
    if (stateCache.has(getHash([...modules.values()]))) {
        let [h, l] = stateCache.get(getHash([...modules.values()]))!;
        totalHigh += h;
        totalLow += l;
        continue;
    }

    for (let mod of modules.values()) {
        mod.resetPulseCount();
    }
    let pulsesOnWire = [{ from: "button", to: modules.get("broadcaster")!, pulse: Pulse.Low }];

    // press the button
    while (pulsesOnWire.length > 0) {
        let pulseOnWire = pulsesOnWire.shift()!;
        for (let p of pulseOnWire.to.send(pulseOnWire.from, pulseOnWire.pulse)) {
            pulsesOnWire.push(p);
        }
    }
    let thisHigh = [...modules.values()].reduce((acc, m) => acc + m.pulseCount[Pulse.High], 0);
    let thisLow = [...modules.values()].reduce((acc, m) => acc + m.pulseCount[Pulse.Low], 0);
    console.log(`${i}: Total High: ${thisHigh}, Total Low: ${thisLow}`);
    stateCache.set(getHash([...modules.values()]), [thisHigh, thisLow]);
    totalHigh += thisHigh;
    totalLow += thisLow;
}
console.log(`Total: ${totalHigh * totalLow}`);
// too low: Total High: 7071, Total Low: 12082 = 85431822