import { Day } from "../day";

class Day22 extends Day {

    constructor(){
        super(22);
    }

    solveForPartOne(input: string): string {
        let blocks = getBlocks(input);
        blocks = blocks.sort((a,b)=>a.minZ-b.minZ)
        let settledCoords:coord[] = [];
        for(let i =0; i<blocks.length;i++) {
            while(!isSettled(blocks[i], settledCoords)) {
                blocks[i].lower();
            }
            settledCoords = [...settledCoords, ...blocks[i].cubes]
        }
        let total =0;
        blocks.forEach((block,i)=>{
            let canDisintegrate = true
            for(let j=i+1;j<blocks.length;j++){
                if(i!==j) {
                    if(!isSettled(blocks[j],
                            settledCoords.filter(pos=>!positionInArray(pos,[...block.cubes, ...blocks[j].cubes])))){
                        canDisintegrate = false;
                        break;
                    }
                }
            }
            if(canDisintegrate) {
                total ++;
                console.log(i)
            }

        })
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        return input;
    }
}

function samePosition(pos1:coord, pos2:coord):boolean{
    return pos1[0]===pos2[0] && pos1[1]===pos2[1] && pos1[2]===pos2[2];
}

function positionInArray(pos:coord, arr:coord[]):boolean {
    for(let i=0; i<arr.length; i++) {
        if(samePosition(pos,arr[i])) return true;
    }
    return false;
}

function isSettled(block:block, settledCoords: coord[]):boolean {
    if(block.minZ===1) return true;
    for(let i=0; i<block.cubes.length;i++){
        const cube = block.cubes[i]
        if(cube[2]!== block.minZ) continue;
        if(settledCoords.some(pos=>pos[0]===cube[0] 
                                        && pos[1]===cube[1] 
                                        && (pos[2]===cube[2]-1))){
            return true;
        }
    }
    return false;
}

function getBlocks(input:string):block[] {
    let blocks: block[] =[];
    const lines = input.split('\n')
    lines.forEach(line =>{
        blocks.push(getBlock(line))
    })
    blocks.forEach((block,i)=>block.index=i)
    return blocks;
}

function getBlock(line:string):block {
    const parts = line.split('~');
    let cubes: coord[] = []
    const start = parts[0].split(',').map(str=>Number(str))
    const end = parts[1].split(',').map(str=>Number(str))
    const minX = Math.min(start[0], end[0])
    const maxX = Math.max(start[0], end[0])
    const minY = Math.min(start[1], end[1])
    const maxY = Math.max(start[1], end[1])
    const minZ = Math.min(start[2], end[2])
    const maxZ = Math.max(start[2], end[2])
    if(minX!==maxX) {
        for(let i = minX; i<=maxX; i++){
            cubes.push([i, start[1],start[2]])
        }
    } else if(minY!==maxY) {
        for(let i = minY; i<=maxY; i++){
            cubes.push([start[0], i,start[2]])
        }
    } else {
        for(let i = minZ; i<=maxZ; i++){
            cubes.push([start[0], start[1], i])
        }
    }

    return {
        index:0,
        cubes: cubes,
        lower: function lower(amount?:number) {
            let amountNew = amount || 1;
            this.cubes.forEach(cube=> cube[2]-=amountNew)
            this.minZ -= amountNew
        },
        minZ:minZ
    }
}

type block = {
    index:number,
    cubes: coord[],
    minZ:number,
    lower: (amount?:number)=>void
}

type coord = [number,number,number]

export default new Day22;