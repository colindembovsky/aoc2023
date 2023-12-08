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
                                                            
    countStepsInInstructions(target = "ZZZ", max: number = 100000000): number {
        let steps = 0;
        let cur = this.start;
        while (true) {
            if (cur === target || steps >= max) break;
            let direction = NodeMap.instructions[steps++ % NodeMap.instructions.length];
            let entry = NodeMap.nMap.get(cur)!;
            cur = direction === "L" ? entry.left : entry.right;
        }
        return steps === max ? -1 : steps;
    }

    next() {
        let direction = NodeMap.instructions[NodeMap.curStep % NodeMap.instructions.length];
        let entry = NodeMap.nMap.get(this.curPos)!;
        this.curPos = direction === "L" ? entry.left : entry.right;
    }

    countStepsToTargetWithZ() {
        let endpoints = [...NodeMap.nMap.keys()].filter(k => k.endsWith("Z"));
        let stepNums: number[] = [];
        endpoints.forEach(e => {
            let steps = this.countStepsInInstructions(e);
            if (steps !== -1) {
                stepNums.push(steps);
            }
        });

        console.log(`${this.start}: ${stepNums}`);
        return stepNums;
    }
}