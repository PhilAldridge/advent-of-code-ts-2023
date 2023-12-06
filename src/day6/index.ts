import { Day } from "../day";

class Day6 extends Day {

    constructor(){
        super(6);
    }

    solveForPartOne(input: string): string {
        const sections = input.split('\r\n');
    const times = sections[0].match(/\d+/g)?.map(str=> Number(str));
    const distances = sections[1].match(/\d+/g)?.map(str=> Number(str));
    console.log(distances)
    let total = 1;
    times?.forEach((time,index)=> {
        let ways =0;
        for(let i =1; i<time; i++){
            if((time-i)*i>=(distances as number[])[index]) ways++
        }
        total *= ways
    })
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        const sections = input.replaceAll(" ","").split('\r\n');
        const time = sections[0].match(/\d+/g)?.map(str=> Number(str))[0] || 0;
        const distance = sections[1].match(/\d+/g)?.map(str=> Number(str))[0] || 0;
        const min = Math.ceil((time - Math.sqrt(time*time-4*distance))/2);
        const max = Math.floor((time + Math.sqrt(time*time-4*distance))/2);
        return (max-min+1).toString();
    }
}

export default new Day6;