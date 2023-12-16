export class Range {
    s: number = 0;
    d: number = 0;
    max: number = 0;
    offset: number = 0;
    constructor(line: string) {
        let [destStart, sourceStart, len] = line.split(" ");
        this.s = parseInt(sourceStart);
        this.d = parseInt(destStart);

        let dist = parseInt(len) - 1;
        this.max = this.s + dist;
        this.offset = parseInt(destStart) - this.s;
    }

    isInRange(value: number): boolean {
        return (value >= this.s && value <= this.max);
    }

    getMapValue(value: number): number {
        return value + this.offset;
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

    get boundaries(): number[] {
        let b = this.ranges.filter(x => x.s !== 0).map(x => x.s);
        if (this.ranges.some(x => x.s === 0)) {
            b.push(Math.min(...b) - 1);
        }
        // add the max of the maxes
        b.push(Math.max(...this.ranges.map(x => x.max)) + 1);
        return b.sort((a, b) => a - b);
    }
}

export interface SeedRange {
    Start: number;
    Length: number;
}

export class Almanac {
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
        while(true) {
            if (map.target === targetType) {
                break;
            }
            map = this.maps.find(x => x.source === map.target)!;
            cur = map.getTargetValue(cur);
        }
        return cur;
    }

    mergeRanges(arr1: number[], arr2: number[]): number[] {
        let result = new Set<number>();
        arr1.filter(x => x !== 0).forEach(x => { result.add(x); result.add(x - 1); result.add(x + 1); });
        arr2.filter(x => x !== 0).forEach(x => { result.add(x); result.add(x - 1); result.add(x + 1); });
        return []; // BROKEN
    }

    calcApplicableSourceBoundaries(sourceType = "seed", targetType = "location"): number[] {
        let curMap = this.maps.find(x => x.target === targetType)!;
        let boundaries = [Number.MAX_SAFE_INTEGER];
        
        while (curMap) {
            boundaries = this.mergeRanges(boundaries, curMap.boundaries);
            curMap = this.maps.find(x => x.target === curMap.source)!;
        }
        return boundaries;;
    }
}

/*
humidity-to-location map:
60 56 37
56 93 4
humidity endpoints [0, 55, 56, 92, 93, 96, 97, sys.maxsize]

temperature-to-humidity map:
0 69 1
1 0 69
[0, 55, 56, 92, 93, 96, 97] + 
[68, 69, 70]

temp endpoints [0, 54, 55, 68, 69, 70, 92, 93, 96, 97, sys.maxsize]

light-to-temperature map:
45 77 23
81 45 19
68 64 13

[54, 55, 68, 69, 70, 92, 93, 96, 97] +
[45, 64, 77, 100]

light endpoints [0, 44, 45, 56, 57, 60, 61, 63, 64, 65, 66, 76, 77, 86, 87, 99, 100, sys.maxsize]

water endpoints [0, 17, 18, 24, 25, 51, 52, 63, 64, 67, 68, 70, 71, 72, 73, 83, 84, 93, 94, 95, 99, 100, sys.maxsize]

fertilizer endpoints [0, 6, 7, 10, 11, 28, 29, 35, 36, 52, 53, 55, 56, 60, 61, 63, 64, 67, 68, 70, 71, 72, 73, 83, 84, 93, 94, 95, 99, 100, sys.maxsize]

soil endpoints [0, 13, 14, 15, 21, 22, 25, 26, 43, 44, 50, 51, 52, 53, 54, 55, 56, 60, 61, 63, 64, 67, 68, 70, 71, 72, 73, 83, 84, 93, 94, 95, 99, 100, sys.maxsize]

seed endpoints [0, 13, 14, 15, 21, 22, 25, 26, 43, 44, 49, 50, 51, 52, 53, 54, 58, 59, 61, 62, 65, 66, 68, 69, 70, 71, 81, 82, 91, 92, 93, 97, 98, 99, 100, sys.maxsize]
*/

/*
d  s  l
60 56 37
56 93 4

0. start with boundaries = [max]
1. mapB = [56, 93, 97]
2. bIndex = 0, mIndex = 0, newB = []
3. while mIndex < mapB.len && bIndex < boundaries.len
    if (boundaries[bIndex] < mapB[mIndex])
      add mapB[mIndex] and mapB[mIndex] - 1 to newB
      mIndex++
      -- newBoundaries = [55, 56]
      -- newBoundaries = [55, 56, 92, 93]
      -- newBoundaries = [55, 56, 92, 93, 96, 97]
    else
      bIndex++
list = [55, 56, 92, 93, 96, 97, max]

temperature-to-humidity map:
0 69 1
1 0 69

boundaries = [55, 56, 92, 93, 96, 97]
mrange = [69, 70]



= [54, 55, 68, 69, 70, 92, 93, 96, 97, max]

start with boundaries = [0, 55, 56, 92, 93, 96, 97, max] and curIndex = 0
set of ranges = [0, 68, 69]

[0, 54, 55, 68, 69, 70, 92, 93, 96, 97, sys.maxsize]

*/