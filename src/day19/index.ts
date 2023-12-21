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
        }
        let total =0
        accepted.container.forEach(present=>{
            total += present['x'] + present['m'] + present['a'] + present['s']
        })
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        const sections = input.split('\n\n');
        const accepted = {label: 'A', container:[]}
        const rejected = {label: 'R', container:[]}
        this.buckets=[];
        this.buckets.push(accepted)
        this.buckets.push(rejected)
        const presents = [{
                xlower:1, xupper:4000, 
                mlower:1, mupper:4000, 
                alower:1, aupper:4000, 
                slower:1, supper:4000
            }]
        this.buckets.push({label:'in', container:presents});
        this.addBuckets(sections[0]);
        let leftToProcess = this.buckets
                .filter(bucket=>bucket.label!=='A' && bucket.label!=='R')
                .reduce((a,c)=>a + c.container.length,0)
        while (leftToProcess>0){
            this.runRules2(sections[0]);
            leftToProcess = this.buckets
                .filter(bucket=>bucket.label!=='A' && bucket.label!=='R')
                .reduce((a,c)=>a + c.container.length,0)
        }
        let total =0
        accepted.container.forEach(present=>{
            console.log(present)
            total += (present['xupper'] - present['xlower']+1)*
                     (present['mupper'] - present['mlower']+1)*
                     (present['aupper'] - present['alower']+1)*
                     (present['supper'] - present['slower']+1);
        })
        return total.toString();
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

    runRules2 = (section:string) => {
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
                    const letter = split[0][0];
                    const symbol = split[0][1];
                    const amount = Number(split[0].substring(2))
                    from.container.forEach(present=>{
                        let toCopy:present = JSON.parse(JSON.stringify(present))
                        let fromCopy:present = JSON.parse(JSON.stringify(present))
                        if(symbol==='>') {
                            if(present[letter+'upper']>amount) {
                                toCopy[letter+'lower'] = Math.max(amount+1,present[letter+'lower'])
                                to.container.push(toCopy)
                            }
                            if(present[letter+'lower']<=amount) {
                                fromCopy[letter+'upper'] = Math.min(amount, present[letter+'upper'])
                                newFromContainer.push(fromCopy)
                            }
                        } else{
                            if(present[letter+'upper']>=amount) {
                                fromCopy[letter+'lower'] = Math.max(amount,present[letter+'lower'])
                                newFromContainer.push(fromCopy)
                            }
                            if(present[letter+'lower']<amount) {
                                toCopy[letter+'upper'] = Math.min(amount-1, present[letter+'upper'])
                                to.container.push(toCopy)
                            }
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
    [key:string]:number
}

type bucket = {
    label:string
    container:present[]
}