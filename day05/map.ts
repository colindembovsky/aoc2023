export class Range {
    min: number = 0;
    max: number = 0;
    offset: number = 0;
    constructor(line: string) {
        let [destStart, sourceStart, len] = line.split(" ");
        this.min = parseInt(sourceStart);
        let dist = parseInt(len) - 1;
        this.max = this.min + dist;
        this.offset = parseInt(destStart) - this.min;
    }

    isInRange(value: number): boolean {
        return (value >= this.min && value <= this.max);
    }

    getMapValue(value: number): number {
        return value + this.offset;
    }
}

export class Map {
    source: string = "";
    target: string = "";
    ranges: Range[] = [];

    constructor(line: string) {
        let lines = line.split("\n").filter(x => x.trim() !== "");
        // parse the first line "seed-to-soil" into "source = seed" and "target = soil"
        [this.source, this.target] = lines.shift()!.split(" ")[0].split("-to-");
        // parse the rest of the lines into ranges
        this.ranges = lines.map(x => new Range(x));
    }

    getTargetValue(value: number): number {
        let targetValue = value;
        this.ranges.forEach(range => {
            if (range.isInRange(value)) {
                targetValue = range.getMapValue(value);
            }
        });
        return targetValue;
    }
}

export class Almanac {
    seeds: number[] = [];
    maps: Map[] = [];

    constructor(contents: string) {
        // split the lines by empty lines
        let lines = contents.split("\n\n");
        let seedLine = lines.shift()!;
        this.seeds = seedLine.split(":")[1].split(" ").filter(x => x.trim() !== "").map(x => parseInt(x));

        // parse the rest of the lines into maps
        this.maps = lines.map(x => new Map(x));
    }

    getLocationForSeed(seed: number): number {
        let cur = seed;
        let map = this.maps.find(x => x.source === "seed")!;
        do {
            cur = map.getTargetValue(cur);
            map = this.maps.find(x => x.source === map.target)!;
        } while (map.target !== "location");
        // one more
        return map.getTargetValue(cur);
    }
}