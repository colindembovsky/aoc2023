export class Reading {
    constructor(public values: number[]) { }

    getNextRow(): Reading {
        let row = [];
        for (let i = 0; i < this.values.length - 1; i++) {
            row.push(this.values[i + 1] - this.values[i]);
        }
        return new Reading(row);
    }

    predictNextNumber() {
        let sum = this.values[this.values.length - 1];

        let nextRow: Reading = this;
        while(true) {
            nextRow = nextRow.getNextRow();
            if (nextRow.values.every(v => v === 0)) {
                break;
            }
            sum += nextRow.values[nextRow.values.length - 1];
        }
        return sum;
    }
}