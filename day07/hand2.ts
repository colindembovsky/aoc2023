function getCardVal(card: string): number {
    const val = card[0];
    switch (val) {
        case 'T': return 10;
        case 'J': return 1;
        case 'Q': return 12;
        case 'K': return 13;
        case 'A': return 14;
        default: return parseInt(val);
    }
}

enum HandType {
    HighCard,
    OnePair,
    TwoPair,
    ThreeOfAKind,
    FullHouse,
    FourOfAKind,
    FiveOfAKind,
}

export class Hand2 {
    private charCounts: Map<string, number> = new Map<string, number>();
    cards: string = "";
    bid: number = 0;
    HandType: HandType = HandType.HighCard;

    constructor(private line: string) {
        let [c, b] = line.split(" ");
        this.cards = c;
        this.bid = parseInt(b);
        
        for (let c of this.cards) {
            let count = this.charCounts.get(c) ?? 0;
            this.charCounts.set(c, count + 1);
        }

        this.HandType = this.calcHandType();
    }

    calcHandType(): HandType {
        // if there are no Js, then return noJokerType
        if (!this.charCounts.has('J')) {
            return this.noJokerType();
        }
        return this.jokerType();
    }

    noJokerType(): HandType {
        let counts = Array.from(this.charCounts.values());
        counts.sort((a, b) => b - a);
        switch (counts[0]) {
            case 5: return HandType.FiveOfAKind;
            case 4: return HandType.FourOfAKind;
            case 3: return counts[1] === 2 ? HandType.FullHouse : HandType.ThreeOfAKind;
            case 2: return counts[1] === 2 ? HandType.TwoPair : HandType.OnePair;
            default: return HandType.HighCard;
        }
    }

    jokerType(): HandType {
        // make a new map of charCounts without the J
        let noJokerCounts = new Map(this.charCounts);
        noJokerCounts.delete('J');
        // find the highest char
        let highestChar = Array.from(noJokerCounts.keys()).reduce((acc, c) => {
            return getCardVal(acc) > getCardVal(c) ? acc : c;
        });
        
        // make all the Js into the highestChar
        let jokerHand = new Hand2(this.line.replace(/J/g, highestChar));
        return jokerHand.HandType;
    }

    compare(other: Hand2): number {
        if (this.HandType !== other.HandType) {
            return this.HandType - other.HandType;
        }
        return this.compareHighCard(other);
    }

    private compareHighCard(other: Hand2): number {
        let i = 0;
        for(; i < this.cards.length; i++) {
            let thisVal = getCardVal(this.cards[i]);
            let otherVal = getCardVal(other.cards[i]);
            if (thisVal !== otherVal) {
                return thisVal - otherVal;
            }
        }
        return 0;
    }
}