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

/*

seed-to-soil map:
   d  s  l
1) 50 98 2
2) 52 50 48

s ->s+l-1    d ->d+l-1    [d - s]
x) 0   -> 49    =  0   -> 49 [  0]
2) 50  -> 97    =  52  -> 99 [ +2]
1) 98  -> 99    =  50  -> 51 [-48]
x) 100 ->       =  100 ->    [  0]

===

soil-to-fertilizer map:
   d  s  l
1) 0  15 37
2) 37 52 2
3) 39 0  15

3) 0  -> 14     = 39 -> 53 [ 39]
1) 15 -> 51     = 0  -> 36 [-15]
2) 52 -> 53     = 37 -> 38 [ 15]
x) 54 ->        = 54 ->    [  0]

===

fertilizer-to-water map:
   d  s  l
1) 49 53 8
2) 0  11 42
3) 42 0  7
4) 57 7  4

3) 0  -> 6      = 42 -> 48 [ 42]
4) 7  -> 10     = 57 -> 60 [ 50]
2) 11 -> 52     = 0  -> 41 [-11]
1) 53 -> 60     = 49 -> 56 [ -4]
x) 61 ->        = 61 ->    [  0]

===

humidity-to-location map:
   d  s  l
1) 60 56 37
2) 56 93 4

   s  -> s+l-1   d  -> d+l-1    [d - s]
x) 0  -> 55    = 0  -> 55 [  0]
1) 56 -> 92    = 60 -> 96 [ +4]
2) 93 -> 96    = 56 -> 59 [-37]
x) 97 ->       = 97 ->    [  0]

boundaries
[0, 55, 56, 92, 93, 96, 97, max]
formula
0 | each(r) => s, s-1 | max(s)+l-1, max(s)+l, infinity
check
0, 55, 56, 92, 93, 96, 97, max

===

temperature-to-humidity map:
d s  l
0 69 1
1 0 69

boundaries
[0, 54, 55, 68, 69, 70, 92, 93, 96, 97, sys.maxsize]

light-to-temperature map:
d  s  l
45 77 23
81 45 19
68 64 13

endpoints:
0, 76, 77, 44, 45, 63, 64, 99, 100, max
0, 44, 45,                 63, 64,         76, 77,         99, 100, max
0, 44, 45, 56, 57, 60, 61, 63, 64, 65, 66, 76, 77, 86, 87, 99, 100, sys.maxsize]

===

79: +2, 0, 0 -> 81
80: +2, 0, 0 -> 82
82: +2, 0, 0 -> 82
83: +2, 0, 0 -> 83
84: +2, 0, 0 -> 84
85: +2, 0, 0 -> 84
86: +2, 0, 0 -> 84
..
98: -48, +15, 0 -> 65
99: -48, +15, 0 -> 66

*/



/*
humidity-to-location map:
60 56 37
56 93 4
humidity endpoints [0, 55, 56, 92, 93, 96, 97, sys.maxsize]

temperature-to-humidity map:
0 69 1
1 0 69
[0, 68, 69, 70], [0, 55, 56, 92, 93, 96, 97]
temp endpoints [0, 54, 55, 68, 69, 70, 92, 93, 96, 97, sys.maxsize]

light-to-temperature map:
45 77 23
81 45 19
68 64 13
light endpoints [0, 44, 45, 56, 57, 60, 61, 63, 64, 65, 66, 76, 77, 86, 87, 99, 100, sys.maxsize]

water endpoints [0, 17, 18, 24, 25, 51, 52, 63, 64, 67, 68, 70, 71, 72, 73, 83, 84, 93, 94, 95, 99, 100, sys.maxsize]

fertilizer endpoints [0, 6, 7, 10, 11, 28, 29, 35, 36, 52, 53, 55, 56, 60, 61, 63, 64, 67, 68, 70, 71, 72, 73, 83, 84, 93, 94, 95, 99, 100, sys.maxsize]

soil endpoints [0, 13, 14, 15, 21, 22, 25, 26, 43, 44, 50, 51, 52, 53, 54, 55, 56, 60, 61, 63, 64, 67, 68, 70, 71, 72, 73, 83, 84, 93, 94, 95, 99, 100, sys.maxsize]

seed endpoints [0, 13, 14, 15, 21, 22, 25, 26, 43, 44, 49, 50, 51, 52, 53, 54, 58, 59, 61, 62, 65, 66, 68, 69, 70, 71, 81, 82, 91, 92, 93, 97, 98, 99, 100, sys.maxsize]
*/

