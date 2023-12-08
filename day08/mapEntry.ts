interface MapEntry {
    left: string;
    right: string;
}

export class NodeMap {
    static nMap: Map<string, MapEntry> = new Map<string, MapEntry>();
    static instructions: string;
    static curStep = 0;
    static parseMap(lines: string[]) {
        lines.forEach(line => {
            let [key, value] = line.split(" = ");
            let [left, right] = value.substring(1, value.length - 1).split(",").map(s => s.trim());
            NodeMap.nMap.set(key, { left, right });
        });
    }

    curPos = "";
    constructor(public start: string) {
        this.curPos = start;
    }

    countStepsInInstructions(target = "ZZZ"): number {
        let steps = 0;
        let cur = this.start;
        while (true) {
            if (cur === target) break;
            let direction = NodeMap.instructions[steps++ % NodeMap.instructions.length];
            let entry = NodeMap.nMap.get(cur)!;
            cur = direction === "L" ? entry.left : entry.right;
        }
        return steps;
    }

    next() {
        let direction = NodeMap.instructions[NodeMap.curStep % NodeMap.instructions.length];
        let entry = NodeMap.nMap.get(this.curPos)!;
        this.curPos = direction === "L" ? entry.left : entry.right;
    }
}