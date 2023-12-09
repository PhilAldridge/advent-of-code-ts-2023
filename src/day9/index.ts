import { Day } from "../day";

class Day9 extends Day {

    constructor(){
        super(9);
    }

    solveForPartOne(input: string): string {
        const seqStrings = input.split('\n');
        let sequences: number[][] = [];
        seqStrings.forEach(str=>{
            sequences.push(str.split(' ').map(num=>Number(num)))
        })
        let answers:number[] = []
        sequences.forEach(sequence=> {
            answers.push(findNextTerm(sequence))
        })
        const total = answers.reduce((a,c)=>a+c,0)
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        const seqStrings = input.split('\n');
        let sequences: number[][] = [];
        seqStrings.forEach(str=>{
            sequences.push(str.split(' ').map(num=>Number(num)))
        })
        let answers:number[] = []
        sequences.forEach(sequence=> {
            answers.push(findNextTerm(sequence.reverse()))
        })
        const total = answers.reduce((a,c)=>a+c,0)
        return total.toString();
    }
}

export default new Day9;

function findNextTerm(sequence:number[]):number {
    if(sequence.length===0) throw new Error("ran out of differences")
    let differences:number[] = [];
    for(let i =0;i<sequence.length-1; i++){
        differences.push(sequence[i+1]-sequence[i])
    }
    if(differences.filter(diff=>diff!==0).length>0) {
        const nextDifference = findNextTerm(differences)
        return sequence[sequence.length-1] + nextDifference
    }
    return sequence[0];
}