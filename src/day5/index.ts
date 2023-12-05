import { Day } from "../day";

class Day5 extends Day {

    constructor(){
        super(5);
    }

    solveForPartOne(input: string): string {
        let seeds = getSeedsPartOne(input);
        const maps = getMapRanges(input);
        maps.forEach(map=> {
            seeds = combineRanges(seeds, map);
        })
        
        return Math.min(...seeds.map(seed=> seed.start)).toString();
    }

    solveForPartTwo(input: string): string {
        let seeds = getSeedRanges(input);
        const maps = getMapRanges(input);
        maps.forEach(map=> {
            seeds = combineRanges(seeds, map);
        })
        
        return Math.min(...seeds.map(seed=> seed.start)).toString();
    }
}

export default new Day5;

function getSeedsPartOne(input:string):range[] {
    let result:range[] = [];
    const sections = input.split('\r\n\r\n');
    const numberArray = sections[0].match(/\d+/g)?.map(str=> Number(str));
    if(!numberArray) throw new Error("can't find any numbers!");
    numberArray.forEach(num => {
        result.push({
            start: num,
            end:num
        })
    })
    return result;
}

function getSeedRanges(input:string):range[] {
    let result:range[] = [];
    const sections = input.split('\r\n\r\n');
    const numberArray = sections[0].match(/\d+/g)?.map(str=> Number(str));
    if(!numberArray) throw new Error("can't find any numbers!");
    for(let i=0; i<numberArray.length/2; i++) {
        result.push({
            start: Number(numberArray[2*i]),
            end: Number(numberArray[2*i]) + Number(numberArray[2*i+1]) - 1
        })
    }
    return result;
}

function getMapRanges(input:string):mapping[][] {
    let result:mapping[][] = [];
    const sections = input.split('\r\n\r\n').slice(1);
    sections.forEach(section=> {
        let sectionRanges:mapping[] = [];
        const numberArray = section.match(/\d+/g)?.map(str=> Number(str));
        if(!numberArray) throw new Error("can't find any numbers!");
        for(let i=0; i<numberArray.length/3; i++) {
            sectionRanges.push({
                start: Number(numberArray[3*i+1]),
                end: Number(numberArray[3*i+1])+Number(numberArray[3*i+2])-1,
                adjustment: Number(numberArray[3*i]) - Number(numberArray[3*i+1]) 
        })
        }
        result.push(sectionRanges)
    })
    
    return result;
}

function combineRanges(seeds: range[], nextRange: mapping[]):range[] {
    for(let i=seeds.length-1; i>=0;i--) {
        nextRange.forEach(range=> {
            const seed = seeds[i];
        //No match
        if(seed.start>range.end
            || range.start>seed.end) return;


        //full match
        if(seed.start>=range.start && seed.end<=range.end) {
            seeds[i].start += range.adjustment;
            seeds[i].end += range.adjustment;
            return;
        }

        //Middle match
        if(seed.start<range.start && seed.end>range.end) {
            seeds = seeds.concat([
                {
                    start:seed.start,
                    end: range.start - 1
                },
                {
                    start:range.start + range.adjustment,
                    end: range.end + range.adjustment
                },
                {
                    start:range.end+1 ,
                    end: seed.end
                },
            ]);
        }

        //Upper Match
        if(seed.start>=range.start && seed.end>range.end) {
            seeds = seeds.concat([
                {
                    start:seed.start + range.adjustment,
                    end: range.end + range.adjustment
                },
                {
                    start:range.end+1,
                    end:seed.end
                }
            ])
        }

        //Lower Match
        if(seed.start<range.start && seed.end<=range.end) {
            seeds = seeds.concat([
                {
                    start:range.start + range.adjustment,
                    end:seed.end+range.adjustment
                },
                {
                    start:seed.start,
                    end:range.start-1
                }
            ])
        }

        
        seeds.splice(i,1);
        })
        
    }
    return seeds;
}

type mapping = {
    start:number
    end:number
    adjustment:number
}

type range = {
    start: number
    end:number
}