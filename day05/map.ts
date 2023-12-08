interface MinRange {
    minSourceStart: number;
    maxSourceEnd: number;
    minTargetStart: number;
    maxTargetEnd: number;
}

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

    get minRange(): MinRange {
        return {
            minSourceStart: this.min,
            maxSourceEnd: this.max,
            minTargetStart: this.min + this.offset,
            maxTargetEnd: this.max + this.offset
        };
    }
}

export class TMap {
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

export interface SeedRange {
    Start: number;
    Length: number;
}

export class Almanac {
    static cache = new Map<string, number>();

    seeds: number[] = [];
    maps: TMap[] = [];
    seedRanges: SeedRange[] = [];

    constructor(contents: string) {
        // split the lines by empty lines
        let lines = contents.split("\n\n");
        let seedLine = lines.shift()!;
        this.seeds = seedLine.split(":")[1].split(" ").filter(x => x.trim() !== "").map(x => parseInt(x));

        // parse the rest of the lines into maps
        this.maps = lines.map(x => new TMap(x));

        // parse pairs of seeds into ranges
        for (let i = 0; i < this.seeds.length; i += 2) {
            this.seedRanges.push({ Start: this.seeds[i], Length: this.seeds[i + 1]});
        }
    }

    mapNum(start: number, sourceType = "seed", targetType = "location"): number {
        let map = this.maps.find(x => x.source === sourceType)!;
        let cur = map.getTargetValue(start);
        let nextKeys = [];
        while(true) {
            let key = `${map.source}-${cur}`;
            if (Almanac.cache.has(key)) {
                console.log(`Cache hit: ${key}`);
                return Almanac.cache.get(key)!;
            }

            if (map.target === targetType) {
                break;
            }
            map = this.maps.find(x => x.source === map.target)!;
            cur = map.getTargetValue(cur);
            nextKeys.push(`${map.source}-${cur}`);
        }
        nextKeys.forEach(key => Almanac.cache.set(key, cur));
        return cur;
    }
}