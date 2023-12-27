export class Direction {
    constructor(public row: number, public col: number) {}

    add(other: Direction) {
        return new Direction(this.row + other.row, this.col + other.col);
    } 

    reverse() { return new Direction(-this.row, -this.col); }
    turnLeft() { return new Direction(-this.col, this.row); }
    turnRight() { return new Direction(this.col, -this.row); }

    static up = new Direction(-1, 0);
    static down = new Direction(1, 0);
    static left = new Direction(0, -1);
    static right = new Direction(0, 1);
}

export class Position {
    constructor(public row: number, public col: number) {}

    clone() { return new Position(this.row, this.col); }
    up() { return new Position(this.row - 1, this.col); }
    down() { return new Position(this.row + 1, this.col); }
    left() { return new Position(this.row, this.col - 1); }
    right() { return new Position(this.row, this.col + 1); }
    
    move(dir: Direction) {
        return new Position(this.row + dir.row, this.col + dir.col );
    }

    neighbors() {
        return [this.up(), this.down(), this.left(), this.right()];
    }
}

export interface Route {
    position: Position;
    direction: Direction;
    distance: number;
}

export class PathFinder {
    grid: number[][] = [];
    visited = new Set<string>();
    heatLoss = 0;
    finished = false;
    queue: Route[][] = [];

    constructor(lines: string[], start: Route, private ultra = false) {
        this.grid = lines.map(l => l.split('').map(c => parseInt(c)));
        this.queue.push([start]);
    }

    move(route: Route, direction: Direction) {
        let next: Route = {
            position: route.position.move(direction),
            direction: direction,
            distance: direction === route.direction ? route.distance + 1 : 1
        };
        if (next.position.row < 0 || next.position.col < 0 || next.position.row >= this.grid.length || next.position.col >= this.grid[0].length) {
            return;
        }
        if (!this.ultra) {
            if (next.distance > 3) return;
        }

        let key = `${next.position.row}-${next.position.col}-${next.direction.row}-${next.direction.col}-${next.distance}`;
        if (this.visited.has(key)) {
            return;
        }

        this.visited.add(key);
        let newHeatLoss = this.heatLoss + this.grid[next.position.row][next.position.col];
        this.queue[newHeatLoss] = this.queue[newHeatLoss] ?? [];
        this.queue[newHeatLoss].push(next);
    }

    public findRoute(): number {
        for (let route of this.queue[this.heatLoss] ?? []) {
            if (route.position.row === this.grid.length - 1 && route.position.col === this.grid[0].length - 1) {
                this.finished = true;
                return this.heatLoss;
            }
            if (this.ultra) {
                if (route.distance < 10) {
                    this.move(route, route.direction);
                }
                if (route.distance >= 4) {
                    this.move(route, route.direction.turnLeft());
                    this.move(route, route.direction.turnRight());
                }
            } else {
                this.move(route, route.direction);
                this.move(route, route.direction.turnLeft());
                this.move(route, route.direction.turnRight());
            }
        }
        this.heatLoss++;
        return this.findRoute();
    }
}