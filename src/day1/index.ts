import { Day } from "../day";

class Day1 extends Day {

    constructor(){
        super(1);
    }

    solveForPartOne(input: string, regex?: RegExp, backRegex?: RegExp): string {
        const lines = input.split('\n');
        const words = ['zero','one','two','three','four','five','six','seven','eight','nine'];
        var total = 0;
        lines.forEach(line=> {
            const regExp = regex? regex: /[0-9]/g;
            const backExp = backRegex? backRegex:regExp
            const firstDigitArray = Array.from(line.matchAll(regExp));
            const lastDigitArray = Array.from(line.matchAll(backExp));
            if(!firstDigitArray || !lastDigitArray || firstDigitArray.length===0 || lastDigitArray.length===0) {
                throw new Error("no digits found")
            }
            let firstDigit = firstDigitArray[0][0]===""? firstDigitArray[0][1] : firstDigitArray[0][0];
            let lastDigit = lastDigitArray[lastDigitArray.length-1][0]===""? lastDigitArray[lastDigitArray.length-1][1]:lastDigitArray[lastDigitArray.length-1][0];
            words.forEach((word,i)=>{
                firstDigit = firstDigit.replaceAll(word,i.toString())
                lastDigit = lastDigit.replaceAll(word,i.toString())
            });
            let toAdd = firstDigit+lastDigit;
            total += Number(toAdd)
        })
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        const regex = /(eight|one|two|three|four|five|six|seven|nine|0|1|2|3|4|5|6|7|8|9)/g;
        const backRegex = /(?<=(eight|one|two|three|four|five|six|seven|nine|0|1|2|3|4|5|6|7|8|9))/g;
        const total = this.solveForPartOne(input, regex, backRegex)
        return total.toString();
    }
}

export default new Day1;