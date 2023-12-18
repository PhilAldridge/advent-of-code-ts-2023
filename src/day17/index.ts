import { Day } from "../day";

class Day17 extends Day {

    constructor(){
        super(17);
    }

    solveForPartOne(input: string): string {
        const lines = input.split('\n');
        const totalRows = lines.length;
        const totalCols = lines[0].length;
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
        grid[0].paths=['']

        while(true) {
            grid.sort((a,b)=> a.score-b.score);
            const squareToCalculate = grid[0]
            if(squareToCalculate.colI === totalCols-1 && squareToCalculate.rowI === totalRows-1){
                console.log(squareToCalculate);
                return squareToCalculate.score.toString();
            }

            //Up
            const squareAbove = grid.find(square=>square.colI === squareToCalculate.colI 
                && square.rowI===squareToCalculate.rowI-1
                && square.score >= square.value + squareToCalculate.score);
            if(squareAbove) {
                let validPath=false
                squareToCalculate.paths.forEach((path) => {
                    if(!path.endsWith("UUU")) {
                        squareAbove.paths.push(path+'U')
                        validPath = true
                    }
                })
                if(validPath) squareAbove.score = squareToCalculate.score + squareAbove.value;
            }

            //Down
            const squareBelow = grid.find(square=>square.colI === squareToCalculate.colI 
                && square.rowI===squareToCalculate.rowI+1
                && square.score >= square.value + squareToCalculate.score);
            if(squareBelow) {
                let validPath=false
                squareToCalculate.paths.forEach((path) => {
                    if(!path.endsWith("DDD")) {
                        squareBelow.paths.push(path+'D')
                        validPath=true
                    }
                })
                if (validPath) squareBelow.score = squareToCalculate.score + squareBelow.value;
            }

            //Left
            const squareLeft = grid.find(square=>square.colI === squareToCalculate.colI-1 
                && square.rowI===squareToCalculate.rowI
                && square.score >= square.value + squareToCalculate.score);
            if(squareLeft) {
                let validPath=false
                squareToCalculate.paths.forEach((path) => {
                    if(!path.endsWith("LLL")) {
                        squareLeft.paths.push(path+'L');
                        validPath = true;
                    }
                })
                if (validPath) squareLeft.score = squareToCalculate.score + squareLeft.value;
            }

            //Right
            const squareRight = grid.find(square=>square.colI === squareToCalculate.colI+1 
                && square.rowI===squareToCalculate.rowI
                && square.score >= square.value + squareToCalculate.score);
            if(squareRight) {
                let validPath=false
                squareToCalculate.paths.forEach((path) => {
                    if(!path.endsWith("RRR")) {
                        squareRight.paths.push(path+'R')
                        validPath = true;
                    }
                })
                if (validPath) squareRight.score = squareToCalculate.score + squareRight.value;
            }

            grid.shift();
        }
    }

    solveForPartTwo(input: string): string {
        return input;
    }
}

export default new Day17;

type square = {
    value:number
    colI: number
    rowI: number
    score: number
    paths: string[]
}