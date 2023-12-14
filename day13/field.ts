export class Field {
    h: number = 0;
    v: number = 0;
    constructor(public rows: string[], private otherH: number = -1, private otherV: number = -1) { 
        this.v = this.calcVerticalReflectionIndex(otherV);
        this.h = this.calcHorizontalReflectionIndex(otherH);
    }

    get score() {
        return  this.v + (100 * this.h);
    }

    getVerticalReflectionIndexes(line: string): number[] {
        let indexes = new Set<number>();
        let lineLength = line.length;

        function getLineIndexes(str: string, reverse: boolean = false) {
            for (let i = lineLength - 1; i >= 1; i--) {
                let left = str.substring(0, i);
                let right = str.substring(i).split('').reverse().join('');
                if (left.endsWith(right)) {
                    indexes.add(reverse ? lineLength - i : i);
                }
            }
        }
        getLineIndexes(line);
        getLineIndexes(line.split('').reverse().join(''), true);

        return [...indexes];
    }

    calcVerticalReflectionIndex(other: number) {
        // return the intersection of all the reflection indexes
        let indexes = this.rows.map(l => this.getVerticalReflectionIndexes(l));
        let intersection = indexes[0];
        for (let i = 1; i < indexes.length; i++) {
            intersection = intersection.filter(x => indexes[i].includes(x));
        }
        if (other !== -1) {
            // return the first index that is not the other
            intersection = intersection.filter(x => x !== other);
        }
        return intersection[0] ?? 0;
    }

    calcHorizontalReflectionIndex(otherH: number) {
        for (let row = 1; row < this.rows.length; row++) {
            if (row === otherH) continue;
            let topRows = this.rows.slice(0, row);
            let bottomRows = this.rows.slice(row);

            let match = true;
            while(topRows.length > 0 && bottomRows.length > 0) {
                let top = topRows.pop();
                let bottom = bottomRows.shift();
                if (top !== bottom) {
                    match = false;
                    break;
                }
            }
            if (match && (topRows.length === 0 || bottomRows.length === 0)) {
                return row;
            }
        }
        return 0;
    }

    fixSmudge() {
        let field = this.rows;
        for (let row = 0; row < field.length; row++) {
            let line = field[row];
            for (let col = 0; col < line.length; col++) {
                let smudgeChar = line[col] === '#' ? '.' : '#';
                let newLine = line.substring(0, col) + smudgeChar + line.substring(col + 1);
                let newFieldStr = [...field.slice(0, row), newLine, ...field.slice(row + 1)];
                let nf = new Field(newFieldStr, this.h, this.v);
                if ((nf.v !== 0 || nf.h !== 0) &&
                    (this.v !== nf.v || this.h !== nf.h)) {
                    let v = nf.v;
                    let h = nf.h;
                    if (v !== 0 && h !== 0) {
                        v = Math.abs(nf.v - this.v);
                        h = Math.abs(nf.h - this.h);
                    }
                    let newScore = v + (100 * h);
                    return newScore;
                }
            }
        }
        return 0;
    }
}