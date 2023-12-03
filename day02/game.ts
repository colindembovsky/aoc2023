export class Bag {
    public red = 0;
    public green = 0;
    public blue = 0;

    constructor(contents: string) {
        // parse "3 blue" to 3
        let colorRegex = /(\d+) blue/;
        let match = colorRegex.exec(contents);
        if (match) {
            this.blue = parseInt(match[1]);
        }

        // parse "2 green" to 2
        colorRegex = /(\d+) green/;
        match = colorRegex.exec(contents);
        if (match) {
            this.green = parseInt(match[1]);
        }

        // parse "1 red" to 1
        colorRegex = /(\d+) red/;
        match = colorRegex.exec(contents);
        if (match) {
            this.red = parseInt(match[1]);
        }
    }

    worksForCombo(red: number, green: number, blue: number): boolean {
        return this.red <= red && this.green <= green && this.blue <= blue;
    }
}

export class Game {
    gameNumber: number = 0;
    bags: Bag[] = [];

    constructor(line: string) {
        // regex for Game 1 or Game 10
        let gameRegex = /Game (\d+)/;
        let match = gameRegex.exec(line);
        if (match) {
            this.gameNumber = parseInt(match[1]);
        }

        // split on :
        let bags = line.split(":")[1];
        // split on ;
        let bagList = bags.split(";");
        for (let bag of bagList) {
            this.bags.push(new Bag(bag));
        }
    }

    minCubesPower(): number {
        let red = 0;
        let green = 0;
        let blue = 0;

        for (let bag of this.bags) {
            red = Math.max(red, bag.red);
            green = Math.max(green, bag.green);
            blue = Math.max(blue, bag.blue);
        }

        return red * green * blue;
    }
}