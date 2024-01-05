import { Day } from "../day";

class Day22 extends Day {

    constructor(){
        super(22);
    }

    solveForPartOne(input: string): string {
        const blocks = getBlocks(input);
        settleBlocks(blocks)
        let total =0;
        for(let i=0;i<blocks.length;i++){
            let canDisintegrate = true
            for(let j=i+1;j<blocks.length;j++){
                if(blocks[j].restingOnBlockIndex.length===1 && blocks[j].restingOnBlockIndex.includes(i)){
                    canDisintegrate = false;
                    break;
                }
            }
            if(canDisintegrate) {
                total ++;
            }
        }
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        const blocks = getBlocks(input);
        settleBlocks(blocks)
        let total =0;
        for(let i=0;i<blocks.length;i++){
            let blocksDestroyed = [i]
            for(let j=i+1;j<blocks.length;j++){
                if(blocks[j].restingOnBlockIndex.length>0 && blocks[j].restingOnBlockIndex.every(index=> blocksDestroyed.includes(index))){
                    total ++;
                    blocksDestroyed.push(j)
                }
            }            
        }
        return total.toString();
    }
}

function settleBlocks(blocks:block[]):coord[] {
    let settledCoords:coord[] = [];
    for(let i =0; i<blocks.length;i++) {
        while(!isSettled(blocks[i], settledCoords)) {
            blocks[i].lower();
        }
        blocks[i].restingOnBlockIndex = getIndexesOfBlocksBelow(blocks[i], blocks.slice(0,i))
        settledCoords = [...settledCoords, ...blocks[i].cubes]
    }
    return settledCoords
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

function getIndexesOfBlocksBelow(block:block, blocksToCheck:block[]):number[] {
    let blocksBelow:number[]=[];
    blocksToCheck.forEach((blockToCheck,i)=>{
        if(isBlockBelow(block, blockToCheck)) {
            blocksBelow.push(i);
        }
    });
    return blocksBelow;
}

function isBlockBelow(above:block, below:block):boolean{
    for(const aboveCube of above.cubes){
        if(aboveCube[2]!==above.minZ){
            continue;
            
        }
        for(const belowCube of below.cubes){
            if(aboveCube[0]===belowCube[0] && aboveCube[1]===belowCube[1] && aboveCube[2]-1===belowCube[2]){
                return true;
            }
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
    return blocks.sort((a,b)=>a.minZ-b.minZ);
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
        cubes: cubes,
        lower: function lower(amount?:number) {
            let amountNew = amount || 1;
            this.cubes.forEach(cube=> cube[2]-=amountNew)
            this.minZ -= amountNew
        },
        minZ:minZ,
        restingOnBlockIndex:[]
    }
}

type block = {
    cubes: coord[],
    minZ:number,
    lower: (amount?:number)=>void,
    restingOnBlockIndex:number[]
}

type coord = [number,number,number]

export default new Day22;