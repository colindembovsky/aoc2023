export interface Instruction {
    direction: string;
    steps: number;
    color: string;
}
    
export class LavaField {
    instructions: Instruction[] = [];
    field: string[] = [];
    curRow = 0;
    curCol = 0;

    get length() {
        return this.field.length;
    }

    get width() {
        if (this.field.length == 0) return 0;
        return this.field[0].length;
    }

    constructor(lines: string[]) {
        for (let line of lines) {
            let [direction, steps, color] = line.split(" ");
            this.instructions.push({
                direction: direction,
                steps: parseInt(steps),
                color: color
            });
        }
    }

    digField() {
        for (let instruction of this.instructions) {
            this.dig(instruction);
        }
    }

    dig(instruction: Instruction) {
        switch (instruction.direction) {
            case "R": {
                this.digRight(instruction.steps, instruction.color);
                break;
            }
            case "L": {
                this.digLeft(instruction.steps, instruction.color);
                break;
            }
            case "U": {
                this.digUp(instruction.steps, instruction.color);
                break;
            }
            case "D": {
                this.digDown(instruction.steps, instruction.color);
                break;
            }
        }
    }

    digRight(steps: number, color: string) {
        // expand the field if necessary
        let expand = this.curCol + steps - this.width
        if (expand > 0) {
            if (this.length == 0) {
                this.field.push("");
                this.curCol = -1;
            }
            let ground = ".".repeat(expand);
            for (let r in this.field) {
                r += ground;
            }
        }

        // dig the row
        let row = this.field[this.curRow];
        let rowChars = row.split("");
        for (let i = 0; i < steps; i++) {
            rowChars[this.curCol + i + 1] = "#";
        }
        row = rowChars.join("");
        this.field[this.curRow] = row;
        this.curCol += steps;
    }

    digDown(steps: number, color: string) {
        let expand = this.curRow + 1 + steps - this.field.length;
        if (expand > 0) {
            let ground = ".".repeat(this.width);
            for (let i = 0; i < expand; i++) {
                this.field.push(ground);
            }
        }

        for (let i = this.curRow + 1; i < this.curRow + 1 + steps; i++) {
            let row = this.field[i];
            let rowChars = row.split("");
            rowChars[this.curCol] = "#";
            row = rowChars.join("");
            this.field[i] = row;
        }

        this.curRow += steps;
    }

    digLeft(steps: number, color: string) {
        // expand the field if necessary
        let expand = steps - this.curCol;
        if (expand > 0) {
            let ground = ".".repeat(expand);
            if (this.length == 0) {
                this.field.push("");
            }
            for (let i = 0; i < this.field.length; i++) {
                this.field[i] = ground + this.field[i];
            }
            this.curCol += expand;
        }

        // dig the row
        let row = this.field[this.curRow];
        let rowChars = row.split("");
        for (let i = steps; i > 0; i--) {
            rowChars[this.curCol - i] = "#";
        }
        row = rowChars.join("");
        this.field[this.curRow] = row;
        this.curCol -= steps;
    }

    digUp(steps: number, color: string) {
        let expand = this.curRow - steps;
        if (expand < 0) {
            let ground = ".".repeat(this.width);
            for (let i = 0; i < -expand; i++) {
                this.field.unshift(ground);
            }
            this.curRow -= expand;
        }

        for (let i = this.curRow - 1; i > this.curRow - 1 - steps; i--) {
            let row = this.field[i];
            let rowChars = row.split("");
            rowChars[this.curCol] = "#";
            row = rowChars.join("");
            this.field[i] = row;
        }

        this.curRow -= steps;
    }

    floodFillFrom(row: number, col: number): number {
        let stack = [[row, col]];
        while (stack.length > 0) {
            let [r, c] = stack.pop()!;
            if (this.field[r][c] === ".") {
                let row = this.field[r];
                let rowChars = row.split("");
                rowChars[c] = "#";
                row = rowChars.join("");
                this.field[r] = row;

                stack.push([r + 1, c]);
                stack.push([r - 1, c]);
                stack.push([r, c + 1]);
                stack.push([r, c - 1]);
            }
        }

        // count the total number of "#" in the field
        let total = 0;
        for (let row of this.field) {
            for (let char of row) {
                if (char === "#") total++;
            }
        }
        return total;
    }
}