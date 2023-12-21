import { Day } from "../day";

class Day21 extends Day {

    constructor(){
        super(21);
    }

    solveForPartOne(input: string): string {
        let rows = input.split('\n');
        let positions = [getStart(rows)];
        const rockPositions = getRocks(rows)
        const rowLength = rows.length;
        const colLength = rows[0].length;
        for(let i=0; i<64; i++){
            positions = updatePositions(positions, rockPositions, rowLength, colLength, false )
        }
        
        return positions.length.toString();
    }

    solveForPartTwo(input: string): string {
        let rows = input.split('\n');
        let positions = [getStart(rows)];
        const rockPositions = getRocks(rows)
        const rowLength = rows.length;
        const colLength = rows[0].length;
        for(let i=0; i<100; i++){
            positions = updatePositions(positions, rockPositions, rowLength, colLength, true )
            //console.log(positions.length)
        }
        
        return positions.length.toString();
    }
}

function getStart(rows:string[]):coords {
    for(let i=0; i<rows.length; i++){
        if(rows[i].includes('S')) return [i,rows[i].indexOf('S')]
    }
    throw new Error ('no S?')
}

function getRocks(rows:string[]):coords[] {
    let rockPositions: coords[] = []
    for(let i=0; i<rows.length; i++){
        for(let j=0; j<rows[i].length; j++) {
            if(rows[i][j]==='#') rockPositions.push([i,j])
        }
    }
    return rockPositions
}

function updatePositions(lastPositions: coords[], rockPositions: coords[], rowLength:number,colLength:number, infinite:boolean):coords[] {
    let newPositions: coords[]=[];
    lastPositions.forEach(pos =>{
        //const allpositions = [...rockPositions, ...newPositions];
        if(available([pos[0],pos[1]+1], rockPositions,newPositions,rowLength,colLength,infinite)) newPositions.push([pos[0],pos[1]+1]);
        if(available([pos[0],pos[1]-1], rockPositions,newPositions,rowLength,colLength,infinite)) newPositions.push([pos[0],pos[1]-1]);
        if(available([pos[0]+1,pos[1]], rockPositions,newPositions,rowLength,colLength,infinite)) newPositions.push([pos[0]+1,pos[1]]);
        if(available([pos[0]-1,pos[1]], rockPositions,newPositions,rowLength,colLength,infinite)) newPositions.push([pos[0]-1,pos[1]]);
    })
    return newPositions
}

function available(pos:coords, rockPositions:coords[], newPositions:coords[], rowLength:number, colLength:number, infinite:boolean):boolean {
    if(!infinite &&(pos[0]<0 || pos[0]>=rowLength || pos[1]<0 || pos[1]>=colLength)) return false;
    if(newPositions.some(place=>place[0]===pos[0] && place[1]===pos[1])) return false;
    while(pos[0]<0) {
        pos[0] += rowLength
    }
    while(pos[1]<0) {
        pos[1] += colLength
    }
    pos[0] = pos[0]%rowLength;
    pos[1] = pos[1]%colLength;
    if(rockPositions.some(place=>place[0]===pos[0] && place[1]===pos[1])) return false;
    return true;
}

type coords = [number,number]

export default new Day21;