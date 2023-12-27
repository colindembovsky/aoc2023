export class Vector {
    constructor(public x: number, public y: number, public z: number) {}

    subtract(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
    }
}

export interface Line {
    L0: Vector;
    d: Vector;
}

export interface Plane {
    P0: Vector;
    n: Vector;
}

export function linesCrossInXYOnVector(l1: Line, l2: Line): Vector | undefined {
    let z = 0;
    let denominator = l1.d.x * l2.d.y - l1.d.y * l2.d.x;
    if (denominator === 0) return undefined; // parallel

    let t = ((l2.L0.x - l1.L0.x) * l2.d.y - (l2.L0.y - l1.L0.y) * l2.d.x) / denominator;
    let tCheck = ((l1.L0.x - l2.L0.x) * l1.d.y - (l1.L0.y - l2.L0.y) * l1.d.x) / -denominator;
    if (t < 0 || tCheck < 0) return undefined; // intersection is in the past
    let x = l1.L0.x + t * l1.d.x;
    let y = l1.L0.y + t * l1.d.y;
    return new Vector(x, y, z);
}

export function getLine(line: string): Line {
    let [point, velocity] = line.split("@").map(s => s.trim());
    let [x,y,z] = point.split(",").map(s => parseInt(s.trim()));
    let [vx,vy,vz] = velocity.split(",").map(s => parseInt(s.trim()));
    return { L0: new Vector(x,y,z), d: new Vector(vx,vy,vz) };
}