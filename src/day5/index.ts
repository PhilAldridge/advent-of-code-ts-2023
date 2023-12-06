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
        return '';
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
            end:num,
            adjusted:false
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
            end: Number(numberArray[2*i]) + Number(numberArray[2*i+1]) - 1,
            adjusted:false
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
    seeds.forEach(seed=>seed.adjusted=false);
    nextRange.forEach(range=> {
        let nextSeeds: range[] = [];
        for(let i=seeds.length-1; i>=0;i--) {
            const seed = seeds[i];
            if(seed.adjusted){
                nextSeeds.push(seed)
                continue;
            } 
            if(seed.start<range.start) {
                //left side
                nextSeeds.push({
                    start: seed.start,
                    end: Math.min(seed.end, range.start-1),
                    adjusted:false
                })
            }

            if(seed.end>range.end) {
                //right side
                nextSeeds.push({
                    start: Math.max(seed.start, range.end+1),
                    end: seed.end,
                    adjusted:false
                })
            }
            
            if(Math.max(seed.start,range.start)<= Math.min(seed.end,range.end)) {
                //overlap
                nextSeeds.push({
                    start: Math.max(seed.start,range.start) + range.adjustment,
                    end: Math.min(seed.end,range.end) + range.adjustment,
                    adjusted: true
                })
            }

        }
        seeds = nextSeeds;
    })
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
    adjusted:boolean
}