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
        const STEPS = 26501365 // number of steps of the puzzle 
        var DIM = 131
        var MAP:Uint8Array= new Uint8Array(DIM * DIM); // always virgin
        var homeRow = 0
        var homeCol = 0
        const FREE = 0
        const ROCK = 1

        function main():string {
            processInput()
            drawDiamond()
            
            // counting used plots for each map(131 x 131) kind:
            const squareA = walkAndCount(homeRow, homeCol, 129)
            const squareB = walkAndCount(homeRow, homeCol, 130)
            const smallTriangleA = walkAndCount(0, 0, 64)
            const smallTriangleB = walkAndCount(0, 130, 64)
            const smallTriangleC = walkAndCount(130, 0, 64)
            const smallTriangleD = walkAndCount(130, 130, 64)
            const bigTriangleA = walkAndCount(0, 0, 195)
            const bigTriangleB = walkAndCount(0, 130, 195)
            const bigTriangleC = walkAndCount(130, 0, 195)
            const bigTriangleD = walkAndCount(130, 130, 195)
            const tailA = walkAndCount(0, 65, 130)
            const tailB = walkAndCount(65, 0, 130)
            const tailC = walkAndCount(65, 130, 130)
            const tailD = walkAndCount(130, 65, 130)
            
            // summing the counts:
            const branche = Math.floor(STEPS / DIM)
            let numberOfSquaresA = 1
            let numberOfSquaresB = 0
            let amount = 0
            
            for (let n = 0; n < branche; n++) { 
                if (n % 2 == 0) { numberOfSquaresA += amount } else { numberOfSquaresB += amount }
                amount += 4
            }    
            
            const rectangles = numberOfSquaresA * squareA + numberOfSquaresB * squareB
            const bigTriangles = bigTriangleA + bigTriangleB + bigTriangleC + bigTriangleD
            const smallTriangles = smallTriangleA + smallTriangleB + smallTriangleC + smallTriangleD
            const tails = tailA + tailB + tailC + tailD
            const result = rectangles + (branche - 1) * bigTriangles + branche * smallTriangles + tails
            
            return result.toString()
        }

        ///////////////////////////////////////////////////////////

        function processInput() {
            const lines = input.split("\n")
            MAP = new Uint8Array(DIM * DIM)
            for (let row = 0; row < DIM; row++) {    
                for (let col = 0; col < DIM; col++) {
                    const index = row * DIM + col
                    if (lines[row][col] == "#") { MAP[index] = ROCK; continue }
                    if (lines[row][col] == "S") { homeRow = row; homeCol = col }
                }
            }
        }

        function cloneVirginMap() {
            const map = new Uint8Array(DIM * DIM)
            for (let n = 0; n < map.length; n++) { map[n] = MAP[n] }
            return map
        }

        ///////////////////////////////////////////////////////////
        function walkAndCount(startRow:number, startCol:number, maxStep :number) {
            const map = walk(startRow, startCol, maxStep) 
            return countPlots(map)
        }

        function walk(startRow:number, startCol:number, maxStep:number) {
            let TARGET = 2
            let FUTURE = 3
            const map = cloneVirginMap()
            const index = startRow * DIM + startCol          
            map[index] = TARGET
            let step = 0
            
            while (true) {
                step += 1
                if (step % 2 == 0) { TARGET = 3; FUTURE = 2 } else { TARGET = 2; FUTURE = 3 }
                for (let row = 0; row < DIM; row++) {
                    for (let col = 0; col < DIM; col++) {
                        const index = row * DIM + col
                        if (map[index] != TARGET) { continue }
                        map[index] = FREE
                        tryWalk(map, row - 1, col, FUTURE)
                        tryWalk(map, row + 1, col, FUTURE)
                        tryWalk(map, row, col - 1, FUTURE)
                        tryWalk(map, row, col + 1, FUTURE)
                    }
                }  
                if (step == maxStep) { return map }
            }      
        }

        function tryWalk(map:Uint8Array, row:number, col:number, FUTURE:number) {
            if (row < 0) { return }
            if (col < 0) { return }
            if (row > DIM - 1)  { return }
            if (col > DIM  - 1) { return }
            const index = row * DIM + col
            if (map[index] == ROCK) { return }
            map[index] = FUTURE
        }

        ///////////////////////////////////////////////////////////
        function countPlots(map:Uint8Array) {
            let count = 0
            for (let row = 0; row < DIM; row++) {
                for (let col = 0; col < DIM; col++) {
                    const index = row * DIM + col
                    if (map[index] == FREE) { continue }
                    if (map[index] == ROCK) { continue }            
                    count += 1
                }
            }
            return count
        }

        ///////////////////////////////////////////////////////////
        function drawDiamond() {
            const map = walk(homeRow, homeCol, 64)
            show(map)
        }

        function show(map:Uint8Array) {
            for (let row = 0; row < DIM; row++) {  
                let s = ""    
                for (let col = 0; col < DIM; col++) {   
                    const index = row * DIM + col
                    s += ".#TF"[map[index]]
                }
                console.log(s)
            }
        }    

        return main();
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

function available(pos:coords, rockPositions:coords[], newPositions:coords[], rowLength:number, colLength:number, infinite:boolean):boolean {
    if(!infinite &&(pos[0]<0 || pos[0]>=rowLength || pos[1]<0 || pos[1]>=colLength)) return false;
    if(newPositions.some(place=>place[0]===pos[0] && place[1]===pos[1])) return false;
    pos[0] = (pos[0]%rowLength + rowLength)%rowLength;
    pos[1] = (pos[1]%colLength + colLength)%colLength;
    if(rockPositions.some(place=>place[0]===pos[0] && place[1]===pos[1])) return false;
    return true;
}

type coords = [number,number]

export default new Day21;