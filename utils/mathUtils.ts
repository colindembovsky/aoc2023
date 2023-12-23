export function gcd(a: number, b: number): number {
    if (b === 0) return a;
    return gcd(b, a % b);
}

export function lcm(numbers: number[]) {
    let lcm = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        lcm = (lcm * numbers[i]) / gcd(lcm, numbers[i]);
    }
    return lcm;
}