import { Day } from "../day";

class Day12 extends Day {

    constructor(){
        super(12);
    }

    solveForPartOne(input: string): string {
        const lines = parseLines(input)
        let total = 0;
        lines.forEach(line=>{
            total += countCorrectCombinations(line.questions,line.definites,line.answer);
        })
        //7599
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        return input;
    }
}

export default new Day12;

type line = {
    questions: number[]
    definites: number[]
    answer: number[]
}

function parseLines(input:string):line[]{
    let lines: line[] = [];
    const linesStr = input.split('\n');
    linesStr.forEach(line=>{
        const sections = line.split(' ');
        let questions:number[] = [];
        let definites:number[] = [];
        for(let i=0;i<sections[0].length;i++){
            if(sections[0][i]==='?') {
                questions.push(i);
            }
            if(sections[0][i]==='#') {
                definites.push(i)
            }
        }
        lines.push({
            questions:questions,
            definites:definites,
            answer: sections[1].split(',').map(str=>Number(str))
        })
    })
    return lines
}

function getAnswer(definites:number[]):number[] {
    let lastNumber = definites[0];
    let runLength = 1;
    let answer:number[] = [];
    for(let i=1;i<definites.length;i++) {
        if(definites[i] === lastNumber+1){
            runLength ++;
        } else {
            answer.push(runLength);
            runLength = 1;
        }
        lastNumber = definites[i];
    }
    answer.push(runLength);
    return answer;
}

function correctArrangement(definites:number[],answer:number[]):number {
    let toCheck = definites.sort((a,b)=>a-b);
    let lastNumber = toCheck[0];
    let runLength = 1;
    let answerIndex = 0;
    for(let i=1;i<toCheck.length;i++) {
        if(toCheck[i] === lastNumber+1){
            runLength ++;
        } else {
            if(answer[answerIndex] !== runLength) return 0;
            answerIndex++;
            runLength = 1;
        }
        lastNumber = toCheck[i];
    }
    if(answerIndex !== answer.length-1 || answer[answerIndex] !== runLength) return 0;
    return 1;
}

function countCorrectCombinations(questions:number[],definites:number[],answer:number[]):number {
    if(questions.length===0) {
        return correctArrangement(definites,answer)
    }
    return countCorrectCombinations(questions.slice(1),[...definites,questions[0]],answer) +
            countCorrectCombinations(questions.slice(1),definites,answer);
}

/*function unfoldLines(lines:line[]):line[] {

}

function unfoldLine(line:line, length:number):line{
    const questions = [...line.questions, ...]
}*/