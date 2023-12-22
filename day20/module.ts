export enum ModType {
    Unspecified,
    FlipFlop,
    Conjunction
}

export enum State {
    On,
    Off
}

export enum Pulse {
    High,
    Low
}

export interface IPulseOnWire {
    from: string;
    to: Mod;
    pulse: Pulse;
}

export class Mod {
    inputs: Mod[] = [];
    outputs: Mod[] = [];
    type = ModType.Unspecified;
    pulseCount: { [key in Pulse]: number } = { [Pulse.High]: 0, [Pulse.Low]: 0 };

    constructor(public name: string) { }

    get stateString() {
        return `${this.name}`;
    }

    resetPulseCount() {
        this.pulseCount = { [Pulse.High]: 0, [Pulse.Low]: 0 };
    }

    send(from: string, pulse: Pulse): IPulseOnWire[] {
        this.pulseCount[pulse]++;
        return [];
    }

    static parseModules(lines: string[]) {
        let modNameOutputMap = new Map<string, string[]>();
        for (let line of lines) {
            let [name, outputString] = line.split(" -> ");
            let outputs = outputString.split(", ");
            modNameOutputMap.set(name, outputs);
        }

        // create modules for each name
        let modules = new Map<string, Mod>();
        for (let [name, _] of modNameOutputMap) {
            let mod: Mod;
            if (name === "broadcaster") {
                mod = new BroadCasterMod(name);
            } else if (name.startsWith("%")) {
                name = name.slice(1);
                mod = new FlipFlopMod(name);
            } else if (name.startsWith("&")) {
                name = name.slice(1);
                mod = new ConjunctionMod(name);
            } else {
                mod = new Mod(name);
            }
            modules.set(name, mod);
        }

        // connect modules
        for (let [name, outputs] of modNameOutputMap.entries()) {
            if (name.startsWith("%") || name.startsWith("&")) {
                name = name.slice(1);
            }
            let mod = modules.get(name)!;
            for (let output of outputs) {
                let outputMod = modules.get(output) ?? new Mod(output);
                mod.outputs.push(outputMod);
                outputMod.inputs.push(mod);
            }
        }
        return modules;
    }
}

export class FlipFlopMod extends Mod {
    isOn = false;
    
    constructor(name: string) {
        super(name);
        this.type = ModType.FlipFlop;
    }

    get stateString() {
        return `${this.name}-${this.isOn ? "1" : "0"}`;
    }

    send(from: string, pulse: Pulse): IPulseOnWire[] {
        super.send(from, pulse);
        if (pulse === Pulse.High) return [];

        let nextPulse = Pulse.High;
        if (this.isOn) {
            nextPulse = Pulse.Low;
        }
        this.isOn = !this.isOn;

        let onwardPulses = [];
        for (let o of this.outputs) {
            onwardPulses.push({ from: this.name, to: o, pulse: nextPulse });
        }
        return onwardPulses;
    }
}

export class ConjunctionMod extends Mod {
    inputMap = new Map<string, Pulse>();

    constructor(name: string) {
        super(name);
        this.type = ModType.Conjunction;
    }

    get stateString() {
        return `${this.name}-${[...this.inputMap.entries()].map(([k, v]) => `${k}-${v}`).join(",")}`;
    }

    send(from: string, pulse: Pulse) {
        super.send(from, pulse);
        this.inputMap.set(from, pulse);
        
        let allHigh = true;
        let allLow = true;
        for (let [_, v] of this.inputMap) {
            if (v === Pulse.Low) allHigh = false;
            if (v === Pulse.High) allLow = false;
        }
        let nextPulse = Pulse.Low;
        if (allLow) nextPulse = Pulse.High;
        
        let onwardPulses = [];
        if (allHigh || allLow) {
            for (let o of this.outputs) {
                onwardPulses.push({ from: this.name, to: o, pulse: nextPulse });
            }
        }
        return onwardPulses;
    }
}

export class BroadCasterMod extends Mod {
    constructor(name: string) {
        super(name);
    }

    send(from: string, pulse: Pulse) {
        super.send(from, pulse);
        let onwardPulses = [];
        for (let o of this.outputs) {
            onwardPulses.push({ from: this.name, to: o, pulse: pulse });
        }
        return onwardPulses;
    }
}
