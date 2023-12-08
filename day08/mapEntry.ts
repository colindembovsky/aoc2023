interface MapEntry {
    left: string;
    right: string;
}

export class NodeMap {
    nMap: Map<string, MapEntry> = new Map<string, MapEntry>();

    constructor(public instructions: string, public lines: string[]) {
        lines.forEach(line => {
            let [key, value] = line.split(" = ");
            let [left, right] = value.substring(1, value.length - 1).split(",").map(s => s.trim());
            this.nMap.set(key, { left, right });
        });
    }

    countStepsInInstructions(start = "AAA", target = "ZZZ"): number {
        let steps = 0;
        let cur = start;
        while (true) {
            if (cur === target) break;
            let direction = this.instructions[steps++ % this.instructions.length];
            let entry = this.nMap.get(cur)!;
            cur = direction === "L" ? entry.left : entry.right;
        }
        return steps;
    }
}