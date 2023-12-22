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
        let allpositions = [getStart(rows)];
        let lastpositions = [getStart(rows)];
        const rockPositions = getRocks(rows)
        const rowLength = rows.length;
        const colLength = rows[0].length;
        let odds = 0, evens=1;
        console.log(Math.floor(26501365/rowLength))
        let answers:number[]=[];
        let firstdifferences: number[]=[];
        let secondDifference: number[]=[];
        for(let i=0; i<1000; i++){
            lastpositions = updatePositionsNew(lastpositions, allpositions, rockPositions, rowLength, colLength )
            if(i%2===0) {
                odds+=lastpositions.length
            } else {
                evens+=lastpositions.length
            }
            allpositions = [...allpositions, ...lastpositions]
            if(allpositions.length > lastpositions.length*10){
                //console.log('cull')
                 allpositions.splice(0,lastpositions.length*5)
            }
            if((i)%rowLength === ((rowLength-1)/2)-1) {
                console.log(evens)
                answers.push(evens)
                if(answers.length>1) firstdifferences.push(answers[answers.length-1] - answers[answers.length-2])
                if(firstdifferences.length>1) secondDifference.push(firstdifferences[firstdifferences.length-1] - firstdifferences[firstdifferences.length-2])
                console.log(firstdifferences)
                console.log(secondDifference)
            }
            //if(i%10===0) console.log(i)
            //console.log(positions.length)
        }
        
        return evens.toString();
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
        if(available([pos[0],pos[1]+1], rockPositions,newPositions,rowLength,colLength,infinite)) newPositions.push([pos[0],pos[1]+1]);
        if(available([pos[0],pos[1]-1], rockPositions,newPositions,rowLength,colLength,infinite)) newPositions.push([pos[0],pos[1]-1]);
        if(available([pos[0]+1,pos[1]], rockPositions,newPositions,rowLength,colLength,infinite)) newPositions.push([pos[0]+1,pos[1]]);
        if(available([pos[0]-1,pos[1]], rockPositions,newPositions,rowLength,colLength,infinite)) newPositions.push([pos[0]-1,pos[1]]);
    })
    return newPositions
}

function updatePositionsNew(lastPositions: coords[], allpositions:coords[], rockPositions: coords[], rowLength:number,colLength:number):coords[] {
    let newPositions: coords[]=[];
    lastPositions.forEach(pos =>{
        const allpositionsUpdated = [...allpositions,...newPositions];
        if(availableNew([pos[0],pos[1]+1], rockPositions,allpositionsUpdated,rowLength,colLength)) newPositions.push([pos[0],pos[1]+1]);
        if(availableNew([pos[0],pos[1]-1], rockPositions,allpositionsUpdated,rowLength,colLength)) newPositions.push([pos[0],pos[1]-1]);
        if(availableNew([pos[0]+1,pos[1]], rockPositions,allpositionsUpdated,rowLength,colLength)) newPositions.push([pos[0]+1,pos[1]]);
        if(availableNew([pos[0]-1,pos[1]], rockPositions,allpositionsUpdated,rowLength,colLength)) newPositions.push([pos[0]-1,pos[1]]);
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

function availableNew(pos:coords, rockPositions:coords[], newPositions:coords[], rowLength:number, colLength:number):boolean {
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