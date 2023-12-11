import { Day } from "../day";

class Day10 extends Day {

    constructor(){
        super(10);
    }

    solveForPartOne(input: string): string {
        const lines = input.split('\n');
        const grid:string[][] = [];
        lines.forEach(line=>grid.push(line.split('')))
        const startPos = getStart(grid);
        let length = 0;
        let currentPos = startPos;
        while(!currentPos.backToStart) {
            length++;
            currentPos = getNextPlace(currentPos,grid);
        }
        return (length/2).toString();
    }

    solveForPartTwo(input: string): string {
        const lines = input.split('\n');
        const grid:string[][] = [];
        const loopGrid:number[][]=[];
        lines.forEach(line=>{
            const split = line.split('')
            grid.push(split)
            loopGrid.push(new Array(split.length).fill(0))
        })
        const startPos = getStart(grid);
        let currentPos = startPos;
        while(!currentPos.backToStart) {
            loopGrid[currentPos.pos[1]][currentPos.pos[0]] = 1;
            currentPos = getNextPlace(currentPos,grid);
        }
        grid[startPos.pos[1]][startPos.pos[0]] = convertS(grid);
        let total =0;
        loopGrid.forEach((row,i)=>{
            let hitLoopCount = 1000;
            let lastHit=''
            row.forEach((col,j)=>{  
                if(col === 1){
                    if(grid[i][j]==='|') hitLoopCount ++;
                    if(grid[i][j]==='F' || grid[i][j] === 'L') {
                        lastHit = grid[i][j]
                    }
                    if(grid[i][j]==='J'){
                        if(lastHit==='F') {
                            hitLoopCount++
                            lastHit=''
                        }
                    }
                    if(grid[i][j]==='7'){
                        if(lastHit==='L'){
                            hitLoopCount++
                            lastHit=''
                        }
                    }

                } else if(hitLoopCount%2 ===1) {
                    total ++;
                }
            })
        })
        return total.toString();
    }
}

export default new Day10;

function getStart(grid:string[][]): place {
    let pos:[number,number] = [-1,-1]
    grid.forEach((r,i)=>{
        r.forEach((c,j)=>{
            if(c==='S'){
                pos = [j,i];
            }
        })
    })
    if(pos[0]===-1) throw new Error("s not found");

    //Up
    if(pos[1] !== 0 && (grid[pos[1]-1][pos[0]]==='F' || grid[pos[1]-1][pos[0]]==='7' || grid[pos[1]-1][pos[0]]==='|')){
        return {
            pos: pos,
            facing: [0,-1],
            backToStart:false
        }
    }
    //Down
    if(pos[1] !== grid.length-1 && (grid[pos[1]+1][pos[0]]==='J' || grid[pos[1]+1][pos[0]]==='L' || grid[pos[1]+1][pos[0]]==='|')){
        return {
            pos: pos,
            facing: [0,1],
            backToStart:false
        }
    }
    //Left
    if(pos[0] !== 0 && (grid[pos[1]][pos[0]-1]==='F' || grid[pos[1]][pos[0]-1]==='L' || grid[pos[1]][pos[0]-1]==='-')){
        return {
            pos: pos,
            facing: [-1,0],
            backToStart:false
        }
    }
    //Right
    if(pos[0] !== grid[0].length-1 && (grid[pos[1]][pos[0]+1]==='J' || grid[pos[1]][pos[0]+1]==='7' || grid[pos[1]][pos[0]+1]==='-')){
        return {
            pos: pos,
            facing: [1,0],
            backToStart:false
        }
    }

    throw new Error('couldnt leave S')
}

function getNextPlace(place:place,grid:string[][]):place {
    const newPos:[number,number] = [place.pos[0]+place.facing[0], place.pos[1]+place.facing[1]]
    const character = grid[newPos[1]][newPos[0]];
    switch(character){
        case 'S':
            return {
                pos:newPos,
                facing:place.facing,
                backToStart:true
            }
        case '|':
        case '-':
            return {
                pos:newPos,
                facing:place.facing,
                backToStart:false
            }
        case 'F':
            if(place.facing[0]===0) {
                return {
                    pos:newPos,
                    facing:[1,0],
                    backToStart:false
                }
            }
            return {
                pos:newPos,
                facing:[0,1],
                backToStart:false
            }
        case '7':
            if(place.facing[0]===0) {
                return {
                    pos:newPos,
                    facing:[-1,0],
                    backToStart:false
                }
            }
            return {
                pos:newPos,
                facing:[0,1],
                backToStart:false
            }
        case 'J':
            if(place.facing[0]===0) {
                return {
                    pos:newPos,
                    facing:[-1,0],
                    backToStart:false
                }
            }
            return {
                pos:newPos,
                facing:[0,-1],
                backToStart:false
            }
        case 'L':
            if(place.facing[0]===0) {
                return {
                    pos:newPos,
                    facing:[1,0],
                    backToStart:false
                }
            }
            return {
                pos:newPos,
                facing:[0,-1],
                backToStart:false
            }
        default: 
            throw new Error ('lost the plot')
    }
}

function convertS(grid:string[][]):string {
    let pos:[number,number] = [-1,-1]
    grid.forEach((r,i)=>{
        r.forEach((c,j)=>{
            if(c==='S'){
                pos = [j,i];
            }
        })
    })
    if(pos[0]===-1) throw new Error("s not found");
    let up =false, down = false, left = false, right=false;
        //Up
        if(pos[1] !== 0 && (grid[pos[1]-1][pos[0]]==='F' || grid[pos[1]-1][pos[0]]==='7' || grid[pos[1]-1][pos[0]]==='|')){
            up=true
        }
        //Down
        if(pos[1] !== grid.length-1 && (grid[pos[1]+1][pos[0]]==='J' || grid[pos[1]+1][pos[0]]==='L' || grid[pos[1]+1][pos[0]]==='|')){
            down=true
        }
        //Left
        if(pos[0] !== 0 && (grid[pos[1]][pos[0]-1]==='F' || grid[pos[1]][pos[0]-1]==='L' || grid[pos[1]][pos[0]-1]==='-')){
            left=true
        }
        //Right
        if(pos[0] !== grid[0].length-1 && (grid[pos[1]][pos[0]+1]==='J' || grid[pos[1]][pos[0]+1]==='7' || grid[pos[1]][pos[0]+1]==='-')){
            right=true
        }
    
    if(up) {
        if(left) return 'J'
        if(right) return 'L'
        if(down) return '|'
    }
    if(left){
        if(right) return '-'
        if(down) return '7'
    }
    if(right && down) return 'F'

    throw new Error('Couldnt convert S')
}

type place = {
    pos: [number,number]
    facing:[number,number]
    backToStart:boolean
}