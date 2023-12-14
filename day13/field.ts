export class Field {
    horizontalReflectionIndex: number = 0;
    verticalReflectionIndex: number = 0;
    constructor(public rows: string[]) { 
        this.calcVerticalReflectionIndex();
        this.calcHorizontalReflectionIndex();
        if (this.horizontalReflectionIndex === 0 && this.verticalReflectionIndex === 0) {
            throw new Error('Invalid field - neither axis is reflected');
        }
        if (this.horizontalReflectionIndex !== 0 && this.verticalReflectionIndex !== 0) {
            throw new Error('Invalid field - both axes are reflected');
        }
    }

    get score() {
        return  this.verticalReflectionIndex + (100 * this.horizontalReflectionIndex);
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

    calcVerticalReflectionIndex() {
        // return the intersection of all the reflection indexes
        let indexes = this.rows.map(l => this.getVerticalReflectionIndexes(l));
        let intersection = indexes[0];
        for (let i = 1; i < indexes.length; i++) {
            intersection = intersection.filter(x => indexes[i].includes(x));
        }
        this.verticalReflectionIndex = intersection[0] ?? 0;
    }

    calcHorizontalReflectionIndex() {
        for (let row = 1; row < this.rows.length; row++) {
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
                this.horizontalReflectionIndex = row;
                break;
            }
        }
    }
}