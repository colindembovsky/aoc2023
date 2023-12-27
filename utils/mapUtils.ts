export class CharMap {
    constructor(private lines: string[]) { }

    get width(): number {
        return this.lines[0].length;
    }

    get height(): number {
        return this.lines.length;
    }

    clone(): CharMap {
        return new CharMap(this.lines);
    }

    get(pos: Position): string | undefined {
        return this.getAt(pos.row, pos.col);
    }

    set(pos: Position, value: string) {
        this.setAt(pos.row, pos.col, value);
    }

    setAt(row: number, col: number, value: string) {
        if (row < 0 || row >= this.height) {
            throw new Error(`Invalid row ${row}`);
        }
        let line = this.lines[row];
        if (col < 0 || col >= this.width) {
            throw new Error(`Invalid col ${col}`);
        }
        this.lines[row] = line.substring(0, col) + value + line.substring(col + 1);
    }

    getAt(row: number, col: number): string | undefined {
        if (row < 0 || row >= this.height) {
            return undefined;
        }
        let line = this.lines[row];
        if (col < 0 || col >= this.width) {
            return undefined;
        }
        return line[col];
    }

    toString() {
        return this.lines.join("\n");
    }
}

export class Direction {
    constructor(public row: number, public col: number) {}

    add(other: Direction) {
        return new Direction(this.row + other.row, this.col + other.col);
    }

    toString() {
        if (this.equals(Direction.up)) { return "up"; }
        if (this.equals(Direction.down)) { return "down"; }
        if (this.equals(Direction.left)) { return "left"; }
        if (this.equals(Direction.right)) { return "right"; }
        return `${this.row},${this.col}`;
    }
    
    reverse() { return new Direction(-this.row, -this.col); }
    turnLeft() { return new Direction(-this.col, this.row); }
    turnRight() { return new Direction(this.col, -this.row); }
    turnUp() { return new Direction(-this.row, this.col); }
    turnDown() { return new Direction(this.row, -this.col); }
    equals(other: Direction) { return this.row === other.row && this.col === other.col; }

    static up = new Direction(-1, 0);
    static down = new Direction(1, 0);
    static left = new Direction(0, -1);
    static right = new Direction(0, 1);
}

export class Position {
    constructor(public row: number, public col: number) {}
    
    static fromString(pos: string) {
        let [row, col] = pos.split(',').map(s => parseInt(s));
        return new Position(row, col);
    }

    toString() {
        return `${this.row},${this.col}`;
    }

    clone() { return new Position(this.row, this.col); }
    up() { return new Position(this.row - 1, this.col); }
    down() { return new Position(this.row + 1, this.col); }
    left() { return new Position(this.row, this.col - 1); }
    right() { return new Position(this.row, this.col + 1); }

    getNeighbors(minRow = 0, maxRow = Number.MAX_SAFE_INTEGER, minCol = 0, maxCol = Number.MAX_SAFE_INTEGER): Position[] {
        let possible = [this.up(), this.down(), this.left(), this.right()];
        return possible.filter(p => p.row >= minRow && p.row < maxRow && p.col >= minCol && p.col < maxCol);
    }

    getNeighborsIncludingDiagonal(minRow = 0, maxRow = Number.MAX_SAFE_INTEGER, minCol = 0, maxCol = Number.MAX_SAFE_INTEGER): Position[] {
        let possible = this.getNeighbors(minRow, maxRow, minCol, maxCol).concat([
            this.up().left(), this.up().right(),
            this.down().left(), this.down().right()
        ]);
        return possible.filter(p => p.row >= minRow && p.row < maxRow && p.col >= minCol && p.col < maxCol);
    }
    
    move(dir: Direction) {
        return new Position(this.row + dir.row, this.col + dir.col );
    }

    directionFrom(other: Position) {
        let [row, col] = [this.row - other.row, this.col - other.col];
        if (row > 1) { row = 1; }
        if (row < -1) { row = -1; }
        if (col > 1) { col = 1; }
        if (col < -1) { col = -1; }
        return new Direction(row, col);
    }

    equals(other: Position) {
        return this.row === other.row && this.col === other.col;
    }
}