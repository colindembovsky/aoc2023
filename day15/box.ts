export enum OpType {
    ADD,
    REMOVE
}

export interface Op {
    type: OpType;
    label: string;
    lens: string;
}

export class Box {
    lenses: string[] = [];
    constructor(public id: number) {}

    static getOp(op: string): Op {
        if (op.indexOf("-") > -1) {
            return {
                label: op.replace("-", ""),
                type: OpType.REMOVE,
                lens: ""
            };
        }
        let [label, lens] = op.split("=");
        return {
            label: label,
            type: OpType.ADD,    
            lens: lens
        };
    }

    performOp(op: Op) {
        if (op.type === OpType.ADD) {
            this.addLens(op.label, op.lens);
        } else {
            this.removeLens(op.label);
        }
    }

    addLens(label: string, lens: string) {
        // find the item in the array where the split by " " first element is the label
        let index = this.lenses.findIndex(l => l.split(" ")[0] === label);
        
        if (index > -1) {
            this.lenses[index] = `${label} ${lens}`;
        } else {
            // insert at the front
            this.lenses.push(`${label} ${lens}`);
        }
    }

    removeLens(label: string) {
        let index = this.lenses.findIndex(l => l.split(" ")[0] === label);
        if (index > -1) {
            this.lenses.splice(index, 1);
        }
    }

    get lensPower(): number {
        return this.lenses.reduce((acc, lens, i) => {
            let [_, power] = lens.split(" ");
            return acc + (this.id + 1) * (i + 1) * parseInt(power);
        }, 0);
    }
}