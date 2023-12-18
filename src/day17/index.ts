import { Day } from "../day";

class Day17 extends Day {

    constructor(){
        super(17);
    }

    solveForPartOne(input: string): string {
        const lines = input.split('\n');
        const totalRows = lines.length;
        const totalCols = lines[0].length;
        let grid = getGrid(input)

        while(true) {
            grid.sort((a,b)=> a.score-b.score);
            const squareToCalculate = grid[0]
            if(squareToCalculate.colI === totalCols-1 && squareToCalculate.rowI === totalRows-1){
                console.log(grid[0])
                return squareToCalculate.score.toString();
            }

            addPaths('U',squareToCalculate,grid);
            addPaths('D',squareToCalculate,grid);
            addPaths('L',squareToCalculate,grid);
            addPaths('R',squareToCalculate,grid);
            grid.shift();
        }
    }

    solveForPartTwo(input: string): string {
        return input;
    }
}

export default new Day17;

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

function addPaths(direction:string, squareToCalculate:square, grid:square[]) {
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
        for(let i=0; i<paths.length; i++){
            const path = paths[i];
            if(path.route.endsWith(direction.repeat(2))) {
                if(repetitionsDone.includes(2)) continue;
                repetitionsDone.push(2)
            } else if(path.route.endsWith(direction)) {
                if(repetitionsDone.includes(1)) continue;
                repetitionsDone.push(1)
            }
            const score = path.score + adjacentSquare.value;
            adjacentSquare.paths.push({ route: path.route + direction, score: score });
            adjacentSquare.score = Math.min(adjacentSquare.score, score);
        }
    }
}

type square = {
    value:number
    colI: number
    rowI: number
    score: number
    paths: {
        route:string
        score:number}[]
}