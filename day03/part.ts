export class Part {
    static lines: string[] = [];
    static symbols: string[] = ["@", "*", "/", "+", "&", "%", "=", "$", "#", "-"];
    isPart: boolean = false;

    constructor(public row: number, public col: number, public num: number) {
        this.isPart = this.calcIsPart();
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
}