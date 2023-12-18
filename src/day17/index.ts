import path from "path";
import { Day } from "../day";

class Day17 extends Day {

    constructor(){
        super(17);
    }

    solveForPartOne(input: string): string {
        const lines = input.split('\n');
        const totalRows = lines.length;
        const totalCols = lines[0].length;
        let grid = getGrid(input);
        const finalSquare = grid.find(square=>square.colI===totalCols-1 && square.rowI===totalRows-1)
        while(grid.length>0) {
            grid.sort((a,b)=> a.score-b.score);
            const squareToCalculate = grid[0];
            purgePaths(squareToCalculate);
            addAll(squareToCalculate,grid)
            grid.shift()
        }
        console.log(finalSquare)
        return (finalSquare as square).score.toString();
    }

    solveForPartTwo(input: string): string {
        return input;
    }
}

export default new Day17;

function purgePaths(square:square) {
    square.paths = square.paths.sort((a,b)=>a.score-b.score);
    let done: string[] = [];
    let newPaths: path2[] = [];
    square.paths.forEach(path=>{
        const lastThreeChars = path.route.substring(path.route.length-3);
        if(!done.includes(lastThreeChars)) {
            done.push(lastThreeChars);
            newPaths.push(path)
        }
    })
    square.paths = newPaths
}

function getGrid(input:string):square[] {
    const lines = input.split('\n');
    let grid: square[] = [];
    lines.forEach((line,lineI)=>{
        for(let i=0; i<line.length;i++) {
            grid.push({
                value:Number(line[i]),
                rowI: lineI,
                colI: i,
                score:100000000,
                paths:[]
            })
        }
    })
    grid[0].score=0;
    grid[0].paths=[{route:'',score:0}]
    return grid;
}

function addAll(squareToCalculate:square,grid:square[]):number {
    return Math.min(
            addPaths('U',squareToCalculate,grid),
            addPaths('D',squareToCalculate,grid),
            addPaths('L',squareToCalculate,grid),
            addPaths('R',squareToCalculate,grid)

    )
}

function addPaths(direction:string, squareToCalculate:square, grid:square[]):number {
    let lineChange=0, colChange=0;
    switch (direction) {
        case 'U':
            lineChange=-1;
            break;

        case 'D':
            lineChange=1;
            break;

        case 'L':
            colChange=-1
            break;

        case 'R':
            colChange=1
            break;
    }

    const adjacentSquare = grid.find(square => square.colI === squareToCalculate.colI + colChange
        && square.rowI === squareToCalculate.rowI + lineChange);
    if (adjacentSquare) {
        const possiblePathsInDirection = squareToCalculate.paths.filter(path=>!path.route.endsWith(direction.repeat(3)));
        const paths = possiblePathsInDirection.sort((a,b)=>a.score-b.score)
        let repetitionsDone:number[] = [];
        let min = adjacentSquare.score;
        for(let i=0; i<paths.length; i++){
            const path = paths[i];
            if(path.route.endsWith(direction.repeat(2))) {
                if(repetitionsDone.includes(2)) continue;
                repetitionsDone.push(2)
            } else if(path.route.endsWith(direction)) {
                if(repetitionsDone.includes(1)) continue;
                repetitionsDone.push(1)
            }
            if(oppositeDirection(path.route,direction)) continue;
            const score = path.score + adjacentSquare.value;
            min = Math.min(score,min)
            adjacentSquare.paths.push({ route: path.route + direction, score: score });
            adjacentSquare.score = Math.min(adjacentSquare.score, score);
        }
        return min;
    }
    return squareToCalculate.score+1000;
}

function oppositeDirection (route:string, nextDirection:string): boolean {
    const directions = ['R', 'D', 'L', 'U']
    const lastChar = route.substring(route.length-1);
    const index1= (directions.indexOf(lastChar)+2)%4;
    const index2 = directions.indexOf(nextDirection);
    return index1===index2
}

type square = {
    value:number
    colI: number
    rowI: number
    score: number
    paths: path2[]
}

type path2 = {
    route:string
    score:number}