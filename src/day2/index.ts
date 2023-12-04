import { Day } from "../day";

type infoForDay = {
    day:number
    info: number[][] //[info number][r,b,g]
}

class Day2 extends Day {

    constructor(){
        super(2);
    }

    solveForPartOne(input: string): string {
        const days = parseDays(input)
        let total = 0;
        days.forEach(day=>{
            let possible = true;
            day.info.forEach(sample=> {
                if(sample[0]>12 || sample[1]>13 || sample[2]>14) {
                    possible = false
                }
            })
            if(possible) total+=day.day;
        })
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        const days = parseDays(input);
        let total = 0;
        days.forEach(day=>{
            let minRed=0, minGreen=0, minBlue=0;
            day.info.forEach(sample=>{
                minRed = Math.max(minRed, sample[0]);
                minGreen = Math.max(minGreen, sample[1]);
                minBlue = Math.max(minBlue, sample[2]);
            })
            total += (minRed*minGreen*minBlue);
        })
        return total.toString();
    }
}

function parseDays(input: string): infoForDay[] {
    const lines = input.replaceAll('\r','').split('\n');
        let days: infoForDay[] = [];
        lines.forEach(line=>{
            const day = line.substring(5).split(':')[0];
            const info = line.split(': ')[1].split('; ');
            let infoArray: number[][] = [];
            info.forEach(sample=>{
                let sampleArray = [0,0,0];
                const red = sample.match(/(^|\s)\d+(?=\s(red))/)
                if(red) {
                    sampleArray[0] = Number(red[0])
                }

                const green = sample.match(/(^|\s)\d+(?=\s(green))/)
                if(green) {
                    sampleArray[1] = Number(green[0])
                }

                const blue = sample.match(/(^|\s)\d+(?=\s(blue))/)
                if(blue) {
                    sampleArray[2] = Number(blue[0])
                }

                infoArray.push(sampleArray);
            });
            days.push({
                day: Number(day),
                info: infoArray
            })
        })
        return days;
}

export default new Day2;