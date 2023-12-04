export class Card {
    id: number = 0;
    nums: number[] = [];
    winNums: number[] = [];
    matches = 0;
    points = 0;
    constructor(line: string) {
        this.id = parseInt(line.split(":")[0].split(" ")[1]);
        this.nums = line.split(":")[1].split("|")[0].trim().split(" ").filter(x => x.trim() !== "").map(x => parseInt(x));
        this.winNums = line.split(":")[1].split("|")[1].trim().split(" ").filter(x => x.trim() !== "").map(x => parseInt(x));
        this.matches = this.nums.filter(x => this.winNums.includes(x)).length;
        switch (this.matches) {
            case 0:
                this.points = 0;
                break;
            case 1:
                this.points = 1;
                break;
            default:
                this.points = Math.pow(2, this.matches - 1);
                break;
        }
    }
}