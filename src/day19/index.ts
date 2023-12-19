import { checkPrime } from "crypto";
import { Day } from "../day";

class Day19 extends Day {

    constructor(){
        super(19);
    }

    //rulesEngines: ruleEngine[] = [];
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
        this.addBuckets(sections[0]);
        while (accepted.container.length+rejected.container.length<numberOfPresents){
            this.runRules(sections[0]);
            console.log(this.buckets)
        }
        let total =0
        accepted.container.forEach(present=>{
            total += present['x'] + present['m'] + present['a'] + present['s']
        })
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        return input;
    }

    addBuckets = (section:string) => {
        const lines = section.split('\n');
        lines.forEach(line=>{
            const fromStr = line.substring(0,line.indexOf('{'));
            let from = this.buckets.find(bucket=>bucket.label === fromStr);
            if(!from){
                from = {label:fromStr, container:[]}
                this.buckets.push(from)
            }
        })
    }

    runRules = (section:string) => {
        const lines = section.split('\n');
        lines.forEach(line=>{
            const fromStr = line.substring(0,line.indexOf('{'));
            let from = this.buckets.find(bucket=>bucket.label === fromStr);
            const ruleStrings = line.substring(line.indexOf('{')+1, line.indexOf('}')).split(',')
            ruleStrings.forEach(ruleStr=>{
                if(!from) throw new Error('what')
                if(ruleStr.includes(':')) {
                    const split = ruleStr.split(':');
                    const to = this.buckets.find(bucket=>bucket.label===split[1]);
                    if(!to) throw new Error ('Buck not found!' + split[1]);
                    let newFromContainer:present[]=[];
                    
                    from.container.forEach(present=>{
                        if(checkMatch(present,split[0])) {
                            to.container.push(present)
                        } else {
                            newFromContainer.push(present)
                        }
                    })
                    from.container = newFromContainer;
                } else {
                    const to = this.buckets.find(bucket=>bucket.label===ruleStr);
                    if(!to) throw new Error ('Buck not found' + ruleStr);
                    to.container = [...to.container, ...from.container];
                    from.container = [];
                }
            })
        })
    }
}

function checkMatch(present:present,rule:string):boolean {
    const property = present[rule[0]];
    console.log(property)
    if(rule[1]==='>') {
        return present[rule[0]] > Number(rule.substring(2))
    } else {
        return present[rule[0]] < Number(rule.substring(2))
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
    [key:string]:number
}

type bucket = {
    label:string
    container:present[]
}