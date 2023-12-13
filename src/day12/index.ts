import { Day } from "../day";

class Day12 extends Day {

    constructor(){
        super(12);
    }

    solveForPartOne(input: string): string {
        let total = 0;
        const map = new Map<string,number[][]>();
        const lines = parseLines(input,map,1)
        console.log('parsed')
        lines.forEach((line,i)=>{
            total += findValidCombinations(line.combinations,line.answer);
            if(i%100===0) console.log(i)
        })
        //7599
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        let total = 0;
        const map = new Map<string,number[][]>();
        const lines = parseLines(input,map,5)
        console.log('parsed')
        lines.forEach(line=>{
            total += findValidCombinations(line.combinations,line.answer);
        })
        //7599
        return total.toString();
    }
}

export default new Day12;

type line = {
    combinations: number[][][] //section, combinations, combination
    answer: number[]
}

function parseLines(input:string, map: Map<string,number[][]>, repetitions:number):line[]{
    let lines: line[] = [];
    const linesStr = input.split('\n');
    linesStr.forEach(line=>{
        const sections = line.split(' ');
        const parts = sections[0].repeat(repetitions).split('.').filter(str=>str!=='');
        const numberPart = (sections[1]+',').repeat(repetitions);
        console.log(parts);
        console.log(numberPart)
        lines.push({
            combinations: parts.map(part=>getCombinations(part,map)),
            answer: numberPart.split(',').filter(str=>str!=='').map(str=>Number(str))
        })
        
    })
    return lines
}

function getCombinations (input:string, map:Map<string,number[][]>):number[][] {
    if(map.has(input)) return map.get(input) as number[][];
    if(!input.includes('?')) {
        map.set(input,getAnswers(input));
        return map.get(input) as number[][];
    }
    let index = input.indexOf('?');
    for(let i =0; i<input.length/2;i++){
        if(input[input.length/2 + i]==='?') {
            index = input.length/2 + i;
            break;
        } else if(input[input.length/2-i]==='?'){
            index = input.length/2 - i;
            break;
        }
    }
    const leftSide = getCombinations(input.substring(0,index),map);
    const rightSide = getCombinations(input.substring(index+1),map);
    const middle = getCombinations(input.substring(0,index)+'#'+input.substring(index+1),map);
    let answers:number[][] = [...combineSides(leftSide,rightSide),...middle];

    //const answers = [...getCombinations(input.replace('?','.'),map), ...getCombinations(input.replace('?','#'),map)];
    map.set(input, answers);
    return answers;
}

function combineSides(leftSide:number[][], rightSide:number[][]):number[][]{
    let result: number[][]=[];
    leftSide.forEach(leftCombination=>{
        rightSide.forEach(rightCombination=>{
            result.push([...leftCombination,...rightCombination])
        })
    })
    return result;
}

function getAnswers(input:string):number[][] {
    return [input.split('.').map(str=>str.length).filter(num=>num!==0)]
}

function findValidCombinations(combinations:number[][][], answer:number[]):number {
    if(combinations.length===0) return 0;

    //one section left
    if(combinations.length===1) {
        return combinations[0].filter((combination)=>JSON.stringify(combination)===JSON.stringify(answer)).length;
    }

    let total = 0;
    let specificMap = new Map<string,number>();
    for(let j=0; j<combinations[0].length;j++){
        const combination = combinations[0][j]
        const combinationString = JSON.stringify(combination)
        if(specificMap.has(combinationString)) {
            total += specificMap.get(combinationString) as number;
        } else {
            let match = true;
            if(combination.length>answer.length) {
                match =false;
            }else{
                for(let i=0; i<combination.length; i++) {
                    if(combination[i]!==answer[i]) match=false;
                }
            }
            if(!match) {
                specificMap.set(combinationString,0);
                continue;
            }
            specificMap.set(combinationString, findValidCombinations(combinations.slice(1),answer.slice(combination.length)))
            total += specificMap.get(combinationString) as number;
        }
    }
    return total;
}