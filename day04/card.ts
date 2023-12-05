export class Card {
    static originalCards: Card[] = [];
    static matchValue: Map<number, number> = new Map<number, number>();

    id: number = 0;
    nums: number[] = [];
    winNums: number[] = [];
    matches = 0;
    points = 0;
    constructor(line: string) {
        this.id = parseInt(line.split(":")[0].match(/\d+/)![0]);
        this.nums = line.split(":")[1].split("|")[0].trim().split(" ").filter(x => x.trim() !== "").map(x => parseInt(x));
        this.winNums = line.split(":")[1].split("|")[1].trim().split(" ").filter(x => x.trim() !== "").map(x => parseInt(x));
        this.matches = this.nums.filter(x => this.winNums.includes(x)).length;
        switch (this.matches) {
            case 0:
                this.points = 0;
                break;
            default:
                this.points = Math.pow(2, this.matches - 1);
                break;
        }
    }

    calculateCopies(): number {
        if ((this.matches === 0)) {
            Card.matchValue.set(this.id, 0);
        }

        if (!Card.matchValue.has(this.id)) {
            let copies = 0;
            for (let i = this.id; i < Math.min(this.id + this.matches, Card.originalCards.length - 1); i++) {
                let wCard = Card.originalCards[i];
                copies += wCard.calculateCopies();
            }
            Card.matchValue.set(this.id, copies + this.matches);
        }

        return Card.matchValue.get(this.id)!;
    }
}