import { Day } from "../day";

class Day8 extends Day {

    constructor(){
        super(8);
    }

    solveForPartOne(input: string): string {
        const directions = getDirections(input);
        const mappings = getMappings(input)
        return traverseMaps(directions,mappings,'AAA','ZZZ').toString();
    }

    solveForPartTwo(input: string): string {
        const directions = getDirections(input);
        const mappings = getMappings(input);

        return traverseMapsSimultaneously(directions,mappings).toString();
    }
}

export default new Day8;

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

function getMappings(input:string):mapping[]{
    let mappings: mapping[] =[]
    const mapStr = input.split("\n").slice(2);

    mapStr.forEach(str=>{
        mappings.push({
            name: str.substring(0,3),
            0: str.substring(7,10),
            1: str.substring(12,15)
        }) 

    })


    return mappings;
}

function traverseMaps(directions:number[],mappings:mapping[], start:string, end:string): number{
    let turns = 0;
    let currentPosition = start;
    while(currentPosition!==end) {
        const map = mappings.find(map=>map.name===currentPosition);
        if(!map) throw new Error("got lost");
        currentPosition = map[directions[turns%directions.length]];
        turns ++
    }
    return turns;
}

function traverseMapsSimultaneously(directions:number[], mappings: mapping[]): number {
    let turns = 0;
    let currentPositions = mappings.filter(map=>map.name.endsWith("A")).map(map=>map.name);
    while(currentPositions.filter(name=>name.endsWith('Z')).length< 1/*currentPositions.length*/) {
        let newPositions: string[] = [];
        currentPositions.forEach(pos=> {
            const map = mappings.find(map=>map.name===pos);
            if(!map) throw new Error("got lost at " + pos);
            newPositions.push(map[directions[turns%directions.length]]);
        })
        currentPositions = newPositions;
        
        turns ++;
    }

    return turns;
}

type mapping = {
    name: string,
    [key:number] : string
}