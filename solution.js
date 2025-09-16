const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let inputData = '';

rl.on('line', (line) => {
    inputData += line;
});

rl.on('close', () => {
    try {
        const data = JSON.parse(inputData);
        const n = data.keys.n;
        const k = data.keys.k;

        let points = [];
        for (let key in data) {
            if (key === 'keys') continue;
            const x = BigInt(key);
            const base = data[key].base;
            const value = data[key].value;
            const y = convertBase(value, base);
            points.push({ x, y });
        }

        points.sort((a, b) => a.x < b.x ? -1 : a.x > b.x ? 1 : 0);

        points = points.slice(0, k);

        let constantTerm = 0n;
        const kPoints = points.length;

        for (let i = 0; i < kPoints; i++) {
            let numerator = 1n;
            let denominator = 1n;
            for (let j = 0; j < kPoints; j++) {
                if (i === j) continue;
                numerator *= -points[j].x;
                denominator *= points[i].x - points[j].x;
            }
            constantTerm += points[i].y * numerator / denominator;
        }

        console.log(constantTerm.toString());
    } catch (error) {
        console.error("Error:", error);
    }
});

function convertBase(value, base) {
    base = parseInt(base);
    let num = 0n;
    for (let i = 0; i < value.length; i++) {
        let char = value[i];
        let digitValue = parseInt(char.toLowerCase(), base);
        if (isNaN(digitValue)) {
            throw new Error(`Invalid digit ${char} for base ${base}`);
        }
        num = num * BigInt(base) + BigInt(digitValue);
    }
    return num;
}