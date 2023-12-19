import { Day } from "../day";

class Day19 extends Day {

    constructor(){
        super(19);
    }

    rulesEngines: ruleEngine[] = [];
    buckets: bucket[] =[];

    solveForPartOne(input: string): string {
        const sections = input.split('\n\n');
        const accepted = {label: 'A', container:[]}
        const rejected = {label: 'R', container:[]}
        this.buckets.push(accepted)
        this.buckets.push(rejected)
        const presents = getPresents(sections[1]);
        this.buckets.push({label:'in', container:presents});
        const numberOfPresents = presents.length;
        while (accepted.container.length+rejected.container.length<numberOfPresents){
            this.runRules(sections[0]);
        }
        return '';
    }

    solveForPartTwo(input: string): string {
        return input;
    }

    runRules = (section:string) => {
        
    }
}

function getPresents(section:string):present[] {
    let presents:present[] = [];
    const presentStrings = section.split('\n');
    presentStrings.forEach(str=>{
        const split= str.split(',')
        presents.push({
            x:Number(split[0].substring(3)),
            m:Number(split[1].substring(2)),
            a:Number(split[2].substring(2)),
            s:Number(split[3].substring(2,split[3].length-1))
        })
    })
    return presents;
}

export default new Day19;

type present = {
    x:number
    m:number
    a:number
    s:number
}

type bucket = {
    label:string
    container:present[]
}