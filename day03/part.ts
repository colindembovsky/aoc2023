export class Part {
    static lines: string[] = [];
    static symbols: string[] = ["@", "*", "/", "+", "&", "%", "=", "$", "#", "-"];
    coords = [0, 0, 0 , 0];

    constructor(public row: number, public col: number, public num: number, public isPart = false) {
        //this.isPart = this.calcIsPart();
        this.coords = [
            Math.max(0, row - 1),
            Math.max(0, col - 1),
            Math.min(row + 1, Part.lines.length - 1),
            Math.min(col + `${num}`.length, Part.lines[row].length - 1)
        ];
    }

    calcIsPart() {
        let rStart = Math.max(0, this.row - 1);
        let rEnd = Math.min(this.row + 1, Part.lines.length - 1);
        let cStart = Math.max(0, this.col - 1);
        let cEnd = Math.min(this.col + `${this.num}`.length, Part.lines[this.row].length - 1);

        for (let r = rStart; r <= rEnd; r++) {
            for (let c = cStart; c <= cEnd; c++) {
                // if the current char is a symbol, break
                if (Part.symbols.includes(Part.lines[r][c])) {
                    return true;
                } else {
                    // if the current char is a number, and it's not the current number, break
                    let x = Part.lines[r][c];
                    if (x !== "." && !x.match(/\d/)) {
                        console.log(`Not a number: ${x}`);
                    }
                }
            }
        }
        return false;
    }

    static touchesSymbol(row: number, col: number) {
        let rStart = Math.max(0, row - 1);
        let rEnd = Math.min(row + 1, Part.lines.length - 1);
        let cStart = Math.max(0, col - 1);
        let cEnd = Math.min(col + 1, Part.lines[row].length - 1);

        for (let r = rStart; r <= rEnd; r++) {
            for (let c = cStart; c <= cEnd; c++) {
                // if the current char is a symbol, break
                if (Part.symbols.includes(Part.lines[r][c])) {
                    return true;
                }
            }
        }
        return false;
    }

    isPossibleGearPart(row: number, col: number) {
        // if row,col is in the coords boundary
        return row >= this.coords[0] && row <= this.coords[2] && col >= this.coords[1] && col <= this.coords[3];
    }
}