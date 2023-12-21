enum Trait {
    x,
    m,
    a,
    s,
};

export class Part {
    accepted: boolean = false;
    values: { [key in Trait]: number } = {
        [Trait.x]: 0,
        [Trait.m]: 0,
        [Trait.a]: 0,
        [Trait.s]: 0,
    };

    get total() { 
        return this.values[Trait.x] + this.values[Trait.m] + this.values[Trait.a] + this.values[Trait.s];        
    }

    constructor(line: string) {
        line = line.slice(0, -1).slice(1);
        let [x,m,a,s] = line.split(',');
        this.values[Trait.x] = parseInt(x.split('=')[1]);
        this.values[Trait.m] = parseInt(m.split('=')[1]);
        this.values[Trait.a] = parseInt(a.split('=')[1]);
        this.values[Trait.s] = parseInt(s.split('=')[1]);
    }

}

export interface PartTest {
    part: Part;
    workflowName: string;
}

export type PartTestResult = (PartTest | boolean);

export class Factory {
    static workflowMap = new Map<string, string>();
    static parts: Part[] = [];

    get total() {
        return Factory.parts.filter(p => p.accepted).reduce((acc, p) => acc + p.total, 0);
    }

    constructor (contents: string) {
        let [workflowLines, partLines] = contents.split('\n\n');

        for (let line of workflowLines.split('\n')) {
            line = line.slice(0, -1);
            let [name, instructions] = line.split('{');
            Factory.workflowMap.set(name, instructions);
        }

        for (let line of partLines.split('\n')) {
            let part = new Part(line);
            part.accepted = this.testPart(part);
            Factory.parts.push(part);
        }
    }

    runTest(part: Part, workflowName: string): PartTestResult {
        let workflow = Factory.workflowMap.get(workflowName)!;
        if (workflowName === "A") { return true; }
        if (workflowName === "R") { return false; }
        let instructions = workflow.split(',');
        for (let instruction of instructions) {
            if (instruction.includes('<')) {
                let [left, right] = instruction.split(':');
                let [trait, value] = left.split('<');
                let traitValue = part.values[Trait[trait as keyof typeof Trait]];
                if (traitValue >= parseInt(value)) {
                    continue;
                } else {
                    return { part, workflowName: right};
                }
            }
            if (instruction.includes('>')) {
                let [left, right] = instruction.split(':');
                let [trait, value] = left.split('>');
                let traitValue = part.values[Trait[trait as keyof typeof Trait]];
                if (traitValue <= parseInt(value)) {
                    continue;
                } else {
                    return { part, workflowName: right};
                }
            }
            if (instruction === "A") { return true; }
            if (instruction === "R") { return false; }
            return { part, workflowName: instruction };
        }
        throw new Error("Could not find a valid workflow");
    }

    testPart(part: Part) {
        let workflowName = "in";
        let result = this.runTest(part, workflowName);
        while (typeof result !== 'boolean') {
            result = this.runTest(result.part, result.workflowName);
        }
        return result;
    }
}

