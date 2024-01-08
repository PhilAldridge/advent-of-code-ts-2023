import { Day } from "../day";

class Day24 extends Day {

    constructor(){
        super(24);
    }

    solveForPartOne(input: string): string {
        const lines = getLines(input)
        const min = 200000000000000;
        const max = 400000000000000
        let total = 0;
        for(let i=0;i<lines.length;i++) {
            for(let j=i+1;j<lines.length;j++){
                const collision = getXYCollision(lines[i],lines[j],false)
                if(collision === null) continue;
                if(collision[0]<min ||collision[0]>max || collision[1]<min || collision[1]>max) continue;
                total ++
            }
        }
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        const lines = getLines(input);
        for(let i=0;i<lines.length;i++) {
            for(let j=i+1;j<lines.length;j++){
                const collision = getXYCollision(lines[i],lines[j],true)
                if(collision === null) continue;
                if(checkZCollision(lines[i],lines[j],collision)) console.log('hey')
            }
        }
        return 'input';
    }
}

export default new Day24;


function checkParallel(line1:Line,line2:Line):boolean {
    return line1.velocity[0]/line2.velocity[0] === line1.velocity[1]/line2.velocity[1] &&
    line1.velocity[0]/line2.velocity[0] === line1.velocity[2]/line2.velocity[2]
}

function checkZCollision(line1:Line, line2:Line, position:[number,number]): boolean {
    const lambda1 = (position[0]-line1.start[0])/line1.velocity[0];
    const lambda2 = (position[1]-line1.start[1])/line1.velocity[1];
    return Math.abs(line1.start[2] + lambda1 * line1.velocity[2] - line2.start[2] + lambda2*line2.velocity[2])<0.1
}

function getXYCollision(line1:Line, line2: Line, allowBackwards:boolean):[number,number] | null {
    const y = (line2.start[0] - line1.start[0] + line1.velocity[0]*line1.start[1]/line1.velocity[1] - line2.velocity[0]*line2.start[1]/line2.velocity[1])/(line1.velocity[0]/line1.velocity[1]- line2.velocity[0]/line2.velocity[1])
    if(isNaN(y)) return null;
    if(!allowBackwards && (y-line1.start[1])/line1.velocity[1]<=0) return null; //backward in time
    if(!allowBackwards && (y-line2.start[1])/line2.velocity[1]<=0) return null; //backward in time
    const x = line1.velocity[0]*(y-line1.start[1])/line1.velocity[1] + line1.start[0]
    if(isNaN(x)) return null;
    return [x,y];
}

function getLines(input:string): Line[] {
    const lineStrings = input.split('\n')
    let lines: Line[]=[];
    for(const lineString of lineStrings) {
        const split = lineString.split('@')
        const startSplit = split[0].split(',');
        const start:[number,number,number] = [Number(startSplit[0]), Number(startSplit[1]), Number(startSplit[2])];
        const endSplit = split[1].split(',');
        const velocity:[number,number,number] = [Number(endSplit[0]), Number(endSplit[1]), Number(endSplit[2])];
        lines.push({
            start:start,
            velocity:velocity
        })   
    }
    return lines;
}

type Line = {
    start: [number,number,number]
    velocity: [number,number,number]
}

type Plane = {
    normal: [number,number,number]
    an: number
}