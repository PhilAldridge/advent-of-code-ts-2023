import { Day } from "../day";

class Day20 extends Day {

    constructor(){
        super(20);
    }

    solveForPartOne(input: string): string {
        let modules = getModules(input);
        modules.push({
            name: 'rx',
            to:[],
            recieve: () => {return []}
        })
        const broadcaster = modules.find(mod=>mod.name==='roadcaster');
        if(!broadcaster) throw new Error('broadcaster not found');
        let signalQueue: signal[] = [];
        let totalLow =0, totalHigh = 0;
        for(let i =0; i<1000; i++) {
            signalQueue = [...signalQueue, ...broadcaster.recieve()];
            //button
            totalLow++;
            while(signalQueue.length>0) {
                const recipient = modules.find(mod=>mod.name===signalQueue[0].to);
                if(!recipient) throw new Error('recipient not found: ' + signalQueue[0].to)
                if(signalQueue[0].type) {
                    totalHigh++;
                } else {
                    totalLow++
                }

                signalQueue = [...signalQueue, ...recipient.recieve(signalQueue[0].type, signalQueue[0].from)];
                signalQueue.shift();
            }
        }
        return (totalHigh*totalLow).toString();
    }

    solveForPartTwo(input: string): string {
        let modules = getModules(input);
        modules.push({
            name: 'rx',
            to:[],
            recieve: () => {return []}
        })
        const broadcaster = modules.find(mod=>mod.name==='roadcaster');
        if(!broadcaster) throw new Error('broadcaster not found');
        let signalQueue: signal[] = [];
        console.log(modules.find(mod=>mod.name==='vr'));
        let vrSendersHigh:number[][] = [[],[],[],[]];
        for(let i =0; i<1000000; i++) {
            signalQueue = [...signalQueue, ...broadcaster.recieve()];
            while(signalQueue.length>0) {
                const recipient = modules.find(mod=>mod.name===signalQueue[0].to);
                if(!recipient) throw new Error('recipient not found: ' + signalQueue[0].to)
                if(recipient.name==='vr') {
                    (recipient as conjunction).inputs.forEach((input: { lastSignal: any; name: string; },j)=>{
                        if(input.lastSignal && !vrSendersHigh[j].includes(i)) {
                            vrSendersHigh[j].push(i)
                        }
                    })
                }
                signalQueue = [...signalQueue, ...recipient.recieve(signalQueue[0].type, signalQueue[0].from)];
                signalQueue.shift();
            }
        }
        //find the loops and find lcm of the 4 loops
        console.log(vrSendersHigh)
        return '';
    }
}

export default new Day20;

type signal = {
    from:string
    to: string
    type: boolean //false low - true high
}

interface module {
    name: string
    to:string[]
    recieve: (signal?:boolean, from?:string)=>signal[]
}

interface flipflop extends module {
    on:boolean
    
}

interface conjunction extends module {
    inputs: {
        name: string
        lastSignal: boolean
    }[]
}

function getModules(input:string):module[] {
    let modules:module[]=[];
    const lines = input.split('\n');
    lines.forEach(line=>{
        switch (line[0]) {
            case '%':
                modules.push(createFlipFlop(line));
                break;
            case '&':
                modules.push(createConjunction(line, lines));
                break;
            case 'b':
                modules.push(createBroadcaster(line));
                break;
            default:
                throw new Error(line)
        }
    })
    return modules;
}

function createBroadcaster(line:string):module {
    const toString = line.split('-> ')[1];
    const tos = toString.split(', ');
    return {
        name: 'roadcaster',
        to:tos,
        recieve: function recieve() {
            return this.to.map(str=> { return {
                from: this.name,
                to:str,
                type:false
            }})
        }
    }
}

function createFlipFlop(line:string):flipflop {
    const name = line.substring(1).split(' ')[0];
    const toString = line.split('-> ')[1];
    const tos = toString.split(', ');
    return {
        name:name,
        on:false,
        to:tos,
        recieve: function recieve (signal?:boolean, from?:string) {
            if(signal) {
                return [];
            }
            this.on = !this.on
            const signals =  this.to.map(str=> { return {
                    from:this.name,
                    to:str,
                    type:this.on
            }})
            return signals;
        }
    }
}

function createConjunction(line:string, lines:string[]):conjunction {
    const name = line.substring(1).split(' ')[0];
    const toString = line.split('-> ')[1];
    const tos = toString.split(', ');
    const inputLines = lines.filter(line=>line.includes(' '+name));
    return {
        name:name,
        to:tos,
        inputs: inputLines.map(str=>{return {
            name: str.substring(1).split(' ')[0],
            lastSignal: false
        }}),
        recieve: function recieve( signal?:boolean, from?:string) {
            const fromInput =  this.inputs.find(input=>input.name === from);
            if(!fromInput) throw new Error('lost '+ from)
            fromInput.lastSignal = signal as boolean
            const type = this.inputs.some(input=>!input.lastSignal)
            //console.log(this)
            return this.to.map(str=> { return {
                from:this.name,
                to:str,
                type:type
            }})
        }
    }
}