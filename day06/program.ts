function calcWinWays(raceTime: number, winDistance: number) {
    let h = 0;
    while(true) {
        let d = ++h * (raceTime - h);
        if (d > winDistance) {
            break;
        }
    }
    return ((raceTime / 2 -h) * 2) + 1;
}

function calcWins(times: number[], distances: number[]) {
    let wayNums = [];
    for (let i = 0; i < times.length; i++) {
        let winWays = calcWinWays(times[i], distances[i]);
        wayNums.push(winWays);
        console.log(`Race time: ${times[i]}, win distance: ${distances[i]}, win ways: ${winWays}`);
    }
    // multiply all win ways
    let totalWays = wayNums.reduce((a, b) => a * b);
    console.log(`Total win ways: ${totalWays}`);
}

console.log(`==== day6: PART 1 ====`);
calcWins([7, 15,  30], [9, 40, 200]);

console.log(`==== day6: PART 2 ====`);
calcWins([ 55, 99, 97, 93], [401, 1485, 2274, 1405]);