import { Day } from "../day";

class Day12 extends Day {

    constructor(){
        super(12);
    }

    solveForPartOne(input: string): string {
        let total = 0;
        const lines = parseLines(input,1)
        lines.forEach((line,i)=>{
            const map = new Map<string,number>();
            total += findValidCombinations(line.pattern,line.answer,map);
        })
        //7599
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        let total = 0;
        const lines = parseLines(input,5)
        lines.forEach(line=>{
            const map = new Map<string,number>();
            total += findValidCombinations(line.pattern,line.answer,map);
        })
        //15454556629917
        return total.toString();
    }
}

export default new Day12;

function parseLines(input:string, repetitions:number):line[]{
    let lines: line[] = [];
    const linesStr = input.split('\n');
    linesStr.forEach(line=>{
        const sections = line.split(' ');
        const patternArray = new Array(repetitions).fill(sections[0]);
        const pattern = patternArray.join('?')
        const numberPart = (sections[1]+',').repeat(repetitions);
        lines.push({
            pattern: pattern,
            answer: numberPart.split(',').filter(str=>str!=='').map(str=>Number(str))
        })
        
    })
    return lines
}

function findValidCombinations(pattern:string, answer:number[], map:Map<string,number>):number {
    //Check if already calculated
    const key = pattern + JSON.stringify(answer)
    if(map.has(key)) return map.get(key) as number;

    //ensure possible
    let definitesLeft = (pattern.match(/\#/g) ||[]).length;
    if(definitesLeft>answer.reduce((a,c)=>a+c),0) {
        map.set(key,0);
        return 0;
    }

    //base case
    const endPositionsOfPossibleSolutios = getAnswerEndPositions(pattern, answer[0]);
    if(answer.length===1) {
        const endPositionsFiltered = endPositionsOfPossibleSolutios.filter(solution=>(pattern.substring(solution+1).match(/\#/g) ||[]).length===0);
        let solutions = endPositionsFiltered.length;
        map.set(key,solutions);
        return solutions;
    }
    
    //otherwise, try each first condition position
    let total = 0;
    endPositionsOfPossibleSolutios.forEach(pos =>{
        total += findValidCombinations(pattern.substring(pos+2),answer.slice(1),map);
    })
    map.set(key,total);
    return total;
}

function getAnswerEndPositions(pattern:string,answer:number):number[] {
    let solutions: number[] = [];
    for(let i =answer-1;i<pattern.length;i++) {
        //passed a definite #. No more solutions possible
        if(i-answer !== -1 && pattern[i-answer] === '#') {
            break;
        }

        //run of ? or # equal to length of answer needed
        let match = true;
        for(let j=0;j<answer;j++) {
            if(pattern[i-j]==='.'){
                match = false;
                break;
            } 
        }

        //if match and not followed by definite #
        if(match && 
        (i===pattern.length-1 || pattern[i+1] !== '#')) {
            solutions.push(i)
        }
    }
    return solutions;
}

type line = {
    pattern: string
    answer: number[]
}