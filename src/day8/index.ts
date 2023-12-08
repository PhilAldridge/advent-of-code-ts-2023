import { Day } from "../day";

class Day8 extends Day {

    constructor(){
        super(8);
    }

    solveForPartOne(input: string): string {
        const directions = getDirections(input);
        const mappings = getMappings(input)
        return traverseMaps(directions,mappings).toString();
    }

    solveForPartTwo(input: string): string {
        const directions = getDirections(input);
        const mappings = getMappings(input);
        const starts = getEndsWithPositions(input, 'A');
        const ends = getEndsWithPositions(input,'Z');
        return traverseMapsSimultaneously(directions,mappings,starts,ends).toString();
    }
}

export default new Day8;

function getLoops(directions:number[], mappings:[number,number][],ends:number[]): number[][] {
    let loops: number[][] = [];
    let mapsChecked: number[] = [];
    ends.forEach(i=> {
        for(let multiplier = 1; multiplier<1000; multiplier++){
            let currentPosition =  i;
            let currentLoop = [i];
            mapsChecked.push(i);
            let turns = 0;
            while(turns<directions.length*multiplier-1) {
                currentPosition = mappings[currentPosition][directions[turns%directions.length]];
                currentLoop.push(currentPosition);
                turns ++  
            }
            currentPosition = mappings[currentPosition][directions[turns%directions.length]];
            if(currentPosition===i) {
                loops.push(currentLoop);
                break;
            }
        }

    })
    return loops;
}

function getLoopZs(loop:number[], ends:number[]): number[] {
    let positions: number[] =[];
    loop.forEach((pos,i)=> {
        if(ends.includes(pos)) positions.push(i);
    })
    return positions;
}

function getDirections(input:string):number[] {
    let directions: number[] = [];
    const dirString = input.split("\n")[0]
    const chars = dirString.split('');
    chars.forEach(char=>{
        switch(char){
            case 'L':
                directions.push(0);
                break;
            case 'R':
                directions.push(1);
                break;
            default:
                break;
        }
    })
    return directions;
}

function getMappings(input:string):[number,number][]{
    let mappings: [number,number][] =[];
    const mapStr = input.split("\n").slice(2);
    const names = mapStr.map(str=> str.substring(0,3)).sort()
    names.forEach(name=> {
        const str = mapStr.find(str=>str.substring(0,3)===name);
        if(!str) throw new Error("Lost"+str);
        const ind1 = names.indexOf(str.substring(7,10));
        const ind2 = names.indexOf(str.substring(12,15));
        if(ind1*ind2<0) throw new Error( str.substring(7,10)+str.substring(12,15));
        mappings.push([ind1, ind2])
    })
    return mappings;
}

function getEndsWithPositions(input:string, end:string):number[] {
    let positions: number[] = [];
    const mapStr = input.split("\n").slice(2);
    const names = mapStr.map(str=> str.substring(0,3)).sort();
    names.forEach((name,i)=> {
        if(name.endsWith(end)) positions.push(i)
    })
    return positions;
}

function traverseMaps(directions:number[],mappings:[number,number][]): number{
    let turns = 0;
    let currentPosition = 0;
    while(currentPosition!==mappings.length-1) {
        currentPosition = mappings[currentPosition][directions[turns%directions.length]];
        turns ++
    }
    return turns;
}

function traverseMapsSimultaneously(directions:number[], mappings: [number,number][], starts: number[], ends:number[]): number {
    let turns = 0;
    let currentPositions = starts;
    console.log(starts)
    const loops = getLoops(directions,mappings,ends);
    const loopStarts = loops.map(loop=>loop[0]);
    let loopsFound:loopFound[] = []
    while(true){
        let newPositions: number[] = [];
        currentPositions.forEach(pos=>{
            if(turns%directions.length===0 && loopStarts.includes(pos)){
                const loop = loops.find(loop2=>loop2[0]===pos);
                if(!loop) throw new Error("What???")
                loopsFound.push({ 
                    index:pos, 
                    foundOnTurn:turns+1,
                    length: loop.length,
                    endPositions: getLoopZs(loop,ends)
                })
            } else {
                newPositions.push(mappings[pos][directions[turns%directions.length]])
            }
        })
        turns++;
        currentPositions = newPositions;
        if(newPositions.length===0) {
            turns = loopsFound.reduce((a,c)=>lcm(a,c.length),1)
            break;
        }
    }
    
    return turns;
}

type loopFound = {
    index:number
    foundOnTurn:number,
    length:number,
    endPositions:number[],
}

function gcd(a:number, b:number):number{
    return a ? gcd(b % a, a) : b;
}

function lcm(a:number, b:number):number {
    return a * b / gcd(a, b);
}