import { Day } from "../day";

class Day16 extends Day {

    constructor(){
        super(16);
    }

    solveForPartOne(input: string): string {
        let grid = setupGrid(input)
        grid[0][0].laser.push([0,1]);
        return energiseGrid(grid).toString();
    }

    solveForPartTwo(input: string): string {
        let max = 0;
        const lines = input.split('\n');
        const linesNumber= lines.length;
        const colsNumber=lines[0].length;
        let grid: square[][];
        for(let i=0; i<linesNumber; i++) {
            grid = setupGrid(input);
            grid[i][0].laser.push([0,1]);
            max = Math.max(max,energiseGrid(grid))
            grid = setupGrid(input);
            grid[i][colsNumber-1].laser.push([0,-1]);
            max = Math.max(max,energiseGrid(grid))
        }

        for(let i=0; i<colsNumber; i++) {
            grid = setupGrid(input);
            grid[0][i].laser.push([1,0]);
            max = Math.max(max,energiseGrid(grid))
            grid = setupGrid(input);
            grid[linesNumber-1][i].laser.push([-1,0]);
            max = Math.max(max,energiseGrid(grid))
        }

        return max.toString();
    }
}

export default new Day16;

function setupGrid(input:string):square[][] {
    const lines = input.split('\n');
    let grid: square[][] = [];
    lines.forEach(line=>{
        let row: square[] = []
        for(let i=0;i<line.length;i++){
            row.push({
                type: line[i],
                laserDirections:[],
                laser:[]
            })
        }
        grid.push(row)
    })
    return grid;
}

function energiseGrid(grid:square[][]):number {
    let movement = true;
        while(movement) {
            movement = false;
            grid.forEach((line,lineI) => {
                for(let i=0;i<line.length;i++){
                    if(line[i].laser.length === 0) continue;
                    movement = true;
                    line[i].laser.forEach(laser=> {
                        traverseGrid({
                            linePos:lineI,
                            colPos:i,
                            facing: laser}, grid);
                    })
                    line[i].laser=[]
                }
            })
        }
        let total = 0;
        grid.forEach(line => {
            for(let i=0;i<line.length;i++){
                if(line[i].laserDirections.length> 0) total++ 
            }
        })
        return total
}

function traverseGrid(laser:laser, grid:square[][]) {
    grid[laser.linePos][laser.colPos].laserDirections.push(laser.facing);
    const nextLaserPositions = getNextLaserPosition(laser, grid);
    
    nextLaserPositions.forEach(nextLaser => {
        if(nextLaser.linePos>=0 && nextLaser.linePos<grid.length &&
            nextLaser.colPos>=0 && nextLaser.colPos<grid[0].length &&
            !grid[nextLaser.linePos][nextLaser.colPos].laserDirections
            .some(direction=> direction[0]===nextLaser.facing[0] && direction[1]===nextLaser.facing[1])) {
                grid[nextLaser.linePos][nextLaser.colPos].laser.push(nextLaser.facing)
            }
    })
}

function getNextLaserPosition(laser:laser, grid: square[][]):laser[] {
    let nextPositions: laser[] = [];
    let newFacing:direction[] = [laser.facing];
    switch(grid[laser.linePos][laser.colPos].type) {
        case '.':
            break;
        case '/':
            newFacing = [rotateForwardSlash(laser.facing)];
            break;
        case '\\':
            newFacing = [rotateBackSlash(laser.facing)];
            break;
        case '|':
            newFacing = splitUpLine(laser.facing);
            break;
        case '-':
            newFacing = splitDash(laser.facing);
            break;
    }

    newFacing.forEach(direction=>{
        nextPositions.push({
            linePos:laser.linePos+direction[0],
            colPos:laser.colPos+direction[1],
            facing:direction
        })
    })
    return nextPositions;
}

function rotateForwardSlash(facing: direction):direction {
    switch(JSON.stringify(facing)) {
        case '[-1,0]':
            return [0,1];
        case '[1,0]':
            return [0,-1];
        case '[0,1]':
            return [-1,0];
        case '[0,-1]':
            return [1,0];
        default:
            throw new Error('facing not found')
    }
}

function rotateBackSlash(facing: direction):direction {
    switch(JSON.stringify(facing)) {
        case '[-1,0]':
            return [0,-1];
        case '[1,0]':
            return [0,1];
        case '[0,1]':
            return [1,0];
        case '[0,-1]':
            return [-1,0];
        default:
            throw new Error('facing not found')
    }
}

function splitUpLine(facing:direction):direction[] {
    if(Math.abs(facing[0])===1) return [facing];
    return [[1,0],[-1,0]]
}

function splitDash(facing:direction):direction[] {
    if(Math.abs(facing[1])===1) return [facing];
    return [[0,1],[0,-1]]
}

type square = {
    type: string
    laserDirections: direction[]
    laser: direction[]
}

type direction = [-1,0] | [1,0] | [0,1] | [0,-1] //Up, Down, Right, Left

type laser = {
    linePos:number
    colPos:number
    facing: direction
}
