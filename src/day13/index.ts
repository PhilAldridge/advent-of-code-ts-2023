import { Day } from "../day";

class Day13 extends Day {

    constructor(){
        super(13);
    }

    solveForPartOne(input: string): string {
        const blocks = input.split('\n\n').map(block=>block.split('\n'))
        let total = 0;
        blocks.forEach(block=> {
            const blockT = transpose(block);
            total += findLineOfReflection(block)[0];
            total += 100*findLineOfReflection(blockT)[0];
        })
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        const blocks = input.split('\n\n').map(block=>block.split('\n'))
        let total = 0;
        blocks.forEach(block=> {
            //replace rows with columns
            const blockT = transpose(block);

            //check solutions with a vertical line
            const verticalSolution =  findLineOfReflection(block)[0];

            //use same function on transposed block for horizontal line
            const horizontalSolution = findLineOfReflection(blockT)[0];


            if(verticalSolution!==0) {
                //find vertical line that is not in the original place
                let smudgeSolution = findTheSmudge(block,verticalSolution);

                //if not found, find horizontal line
                if(smudgeSolution===0) {
                    smudgeSolution = 100*findTheSmudge(blockT);
                }
                total += smudgeSolution;
            } else {
                //find horizontal line that is not in the original place
                let smudgeSolution = 100*findTheSmudge(blockT,horizontalSolution);
                if(smudgeSolution===0) {
                    //i not found, find vertical line
                    smudgeSolution = findTheSmudge(block);
                }
                total += smudgeSolution;
            }
        })
        return total.toString();
    }
}

export default new Day13;

function findLineOfReflection(block:string[]):number[] {
    let possibleSolutions:number[] = []
    for(let i =0; i<block[0].length-1;i++ ){
        possibleSolutions.push(i+1);
    }

    for(let i = 0;i<block.length;i++) {
        possibleSolutions = refineSolutions(block[i],possibleSolutions);
        if(possibleSolutions.length === 0) break;
    }
    if(possibleSolutions.length===0) return [0];
    return possibleSolutions;
}

function refineSolutions(line:string,possibleSolutions:number[]):number[] {
    let newSolutions:number[] = [];
    possibleSolutions.forEach(possibleSolution => {
        const leftSide = line.substring(0,possibleSolution);
        const rightSide = line.substring(possibleSolution);
        let match = true;
        for(let i =0; i<Math.min(leftSide.length,rightSide.length);i++) {
            if(leftSide[leftSide.length - 1 - i]!==rightSide[i]) {
                match = false;
                break;
            }
        }
        if(match) {
            newSolutions.push(possibleSolution)
        }
    })
    return newSolutions;
}

function transpose(block:string[]):string[] {
    let newBlock: string[] = new Array(block[0].length).fill('');
    block.forEach(line=>{
        for(let i =0; i<line.length; i++) {
            newBlock[i] += line[i]
        }
    })
    return newBlock;
}

function findTheSmudge(block:string[], originalLine?:number):number {
    for(let i=0;i<block.length;i++) {
        for(let j=0;j<block[i].length;j++) {
            let newBlock = JSON.parse(JSON.stringify(block));
            if(newBlock[i][j]==='#') {
                newBlock[i] = newBlock[i].substring(0,j)+'.'+newBlock[i].substring(j+1);
            } else {
                newBlock[i] = newBlock[i].substring(0,j)+'#'+newBlock[i].substring(j+1);
            }
            
            //console.log(newBlock)
            let solutions = findLineOfReflection(newBlock).filter(solution=>solution!==0);
            if(originalLine) {
                solutions = solutions.filter(solution => solution!==originalLine)
            } 
            if(solutions.length>0){
                return solutions[0];
            }
        }
    }
    return 0;
}