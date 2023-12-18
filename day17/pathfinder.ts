import { dir } from "console";

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export class Route {
    directionCounter: { [key in Direction]: number };

    constructor(public row: number, public col: number, public direction: Direction, public heatLoss: number = 0) {
        this.directionCounter = {
            [Direction.UP]: 0,
            [Direction.DOWN]: 0,
            [Direction.LEFT]: 0,
            [Direction.RIGHT]: 0,
        };
    }

    from(row: number, col: number, inDirection: Direction, heatLoss: number): Route {
        let route = new Route(row, col, inDirection, this.heatLoss + heatLoss);
        if (this.direction !== inDirection) {
            // reset the direction counter
            route.directionCounter = {
                [Direction.UP]: 0,
                [Direction.DOWN]: 0,
                [Direction.LEFT]: 0,
                [Direction.RIGHT]: 0,
            };
        } else {
            route.directionCounter = { ...this.directionCounter };
        }
        route.directionCounter[inDirection]++;
        return route;
    }
}

export class PathFinder {
    grid: number[][] = [];

    constructor(lines: string[], private startCellHeatLoss: number) {
        this.grid = lines.map(l => l.split('').map(c => parseInt(c)));
    }

    public findSmallestHeatLossPathGoing(startDir: Direction): number {
        const queue: Route[] = [];
        const smallestHeatLossAtNode: number[][] = Array(this.grid.length).fill(Number.MAX_SAFE_INTEGER).map(() => Array(this.grid[0].length).fill(Number.MAX_SAFE_INTEGER));
        queue.push(new Route(0, 0, startDir, -this.startCellHeatLoss));
        let smallestHeatLoss = Number.MAX_SAFE_INTEGER;
        while (queue.length > 0) {
            if (queue.length % 1000 === 0) {
                console.log(`queue length: ${queue.length}`);
            }
            const route = queue.shift()!;
            const { row, col, direction } = route;

            if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length || route.heatLoss >= smallestHeatLossAtNode[row][col]) {
                continue;
            }
            
            if (row === this.grid.length - 1 && col === this.grid[0].length - 1) {
                let finalHeatLoss = route.heatLoss + this.grid[row][col];
                if (finalHeatLoss < smallestHeatLoss) {
                    smallestHeatLoss = finalHeatLoss;
                }
                continue;
            }
            
            smallestHeatLossAtNode[row][col] = route.heatLoss;
            const heatLoss = this.grid[row][col];
            switch (direction) {
                case Direction.UP:
                {
                    if (route.directionCounter[Direction.UP] < 3) {
                        queue.push(route.from(row - 1, col, Direction.UP, heatLoss));
                    }
                    queue.push(route.from(row, col - 1, Direction.LEFT, heatLoss));
                    queue.push(route.from(row, col + 1, Direction.RIGHT, heatLoss));
                    break;
                }
                case Direction.DOWN:
                {
                    if (route.directionCounter[Direction.DOWN] < 3) {
                        queue.push(route.from(row + 1, col, Direction.DOWN, heatLoss));
                    }
                    queue.push(route.from(row, col - 1, Direction.LEFT, heatLoss));
                    queue.push(route.from(row, col + 1, Direction.RIGHT, heatLoss));
                    break;
                }
                case Direction.LEFT:
                {
                    if (route.directionCounter[Direction.LEFT] < 3) {
                        queue.push(route.from(row, col - 1, Direction.LEFT, heatLoss));
                    }
                    queue.push(route.from(row - 1, col, Direction.UP, heatLoss));
                    queue.push(route.from(row + 1, col, Direction.DOWN, heatLoss));
                    break;
                }
                case Direction.RIGHT:
                {
                    if (route.directionCounter[Direction.RIGHT] < 3) {
                        queue.push(route.from(row, col + 1, Direction.RIGHT, heatLoss));
                    }
                    queue.push(route.from(row - 1, col, Direction.UP, heatLoss));
                    queue.push(route.from(row + 1, col, Direction.DOWN, heatLoss));
                    break;
                }
            }
        }
        return smallestHeatLoss;
    }

    findSmallestHeatLossPath(): number {
        let heatLossDown = this.findSmallestHeatLossPathGoing(Direction.DOWN);
        let heatLossRight = this.findSmallestHeatLossPathGoing(Direction.RIGHT);
        return Math.min(heatLossDown, heatLossRight);
    }
}