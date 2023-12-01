import { loadInput, dayName, Difficulty } from "../utils/readUtils";

let day = dayName(__dirname);
let contents = loadInput(__dirname, Difficulty.HARD);

//console.log(contents);

console.log(`==== ${day}: PART 1 ====`);
let lines = contents.split("\n");

// for each line, work out the first and last digit in the line and create a number from the 2 digits
let digits = lines.map((line) => {
    // find the first char in the line that is a digit
    let firstDigitIndex = line.search(/\d/);
    let firstDigit = line[firstDigitIndex];
    // find the last char in the line that is a digit
    let lastDigitIndex = line.search(/\d(?=\D*$)/);
    let lastDigit = line[lastDigitIndex];
    // create a number from the 2 digits
    return parseInt(firstDigit + lastDigit);
});

console.log(digits.reduce((a, b) => a + b));

console.log(`==== ${day}: PART 2 ====`);
lines = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`.split("\n");

let textNums = `zero
one
two
three
four
five
six
seven
eight
nine`.split("\n");

function getLineNum(line: string) {
    let firstDigitIndex = line.search(/\d/);
    let lastDigitIndex = line.search(/\d(?=\D*$)/);

    // find the first index of any occurrence of one of the textNums in the line
    // record the word that is the first
    let firstWord = textNums.reduce((acc, textNum) => {
        let index = line.indexOf(textNum);
        return index < acc.index && index >= 0 ? { index, textNum } : acc;
    }, { index: line.length, textNum: "" });

    // find the last index of any occurrence of one of the textNums in the line
    // record the word that is the last
    let lastWord = textNums.reduce((acc, textNum) => {
        let index = line.lastIndexOf(textNum);
        return index > acc.index ? { index, textNum } : acc;
    }, { index: 0, textNum: "" });
    
    let firstDigit = line[firstDigitIndex];
    // if the first digit index is after the first word index, then the first digit is the first word
    if (firstDigitIndex === -1 || firstWord.index < firstDigitIndex) {
        // first digit is the index of the first word in the textNums array
        firstDigit = textNums.indexOf(firstWord.textNum).toString();
    }


    let lastDigit = line[lastDigitIndex];
    // if the first digit index is after the first word index, then the first digit is the first word
    if (lastDigitIndex === -1 || lastWord.index > lastDigitIndex) {
        // first digit is the index of the first word in the textNums array
        lastDigit = textNums.indexOf(lastWord.textNum).toString();
    }

    return parseInt(firstDigit + lastDigit);
}

// test
//console.log(lines.map(getLineNum).reduce((a, b) => a + b));

// real
lines = contents.split("\n");
console.log(lines.map(getLineNum).reduce((a, b) => a + b));