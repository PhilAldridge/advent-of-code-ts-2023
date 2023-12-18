import { Day } from "../day";

class Day18 extends Day {

    constructor(){
        super(18);
    }

    solveForPartOne(input: string): string {
        const lines = input.split('\n');
        let grid:string[]= new Array(lines.length).fill(' '.repeat(1000));
        let position = [237,500];
        
        lines.forEach(line=>{
            const command = line.split(' ');
            const amount = Number(command[1])
            switch(command[0]) {
                case 'U':
                    for(let i = 1;i<=amount; i++){
                        grid[position[0]-i] = grid[position[0]-i].substring(0,position[1]) + '#'+ grid[position[0]-i].substring(position[1]+1);
                    }
                    position[0] -= amount;
                    break;
                case 'D':
                    for(let i = 1;i<=amount; i++){
                        grid[position[0]+i] = grid[position[0]+i].substring(0,position[1]) + '#'+ grid[position[0]+i].substring(position[1]+1);
                    }
                    position[0] += amount;
                    break;
                case 'L':
                    grid[position[0]] = grid[position[0]].substring(0,position[1]-amount) + '#'.repeat(amount) +grid[position[0]].substring(position[1]);
                    position[1] -= amount;
                    break;
                case 'R':
                    grid[position[0]] = grid[position[0]].substring(0,position[1]+1) + '#'.repeat(amount) +grid[position[0]].substring(position[1]+1+amount);
                    position[1] += amount;
                    break;
            }
        });
        //console.log(grid[0].length)
        let total = 0

        //growLake(399,399,grid)
        console.log(grid)
        grid.forEach(line=>{
            //console.log(line.trim())
            total += (line.trim()).length;
        })
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        return input;
    }
}

function growLake(lineI:number, colI:number, grid: string[]):string[] {
    if(grid[lineI][colI]==='#') return grid;
    grid[lineI] = grid[lineI].substring(0,colI) + '#' + grid[lineI].substring(colI+1)
    if(lineI!== 0 && grid[lineI-1][colI]!=='#') grid = growLake(lineI-1,colI,grid);
    if(lineI!== grid.length-1 && grid[lineI+1][colI]!=='#') grid = growLake(lineI+1,colI,grid);
    if(colI!==0 && grid[lineI][colI-1]!=='#') grid = growLake(lineI,colI-1,grid);
    if(colI!== grid[0].length-1 && grid[lineI][colI+1]!=='#') grid = growLake(lineI,colI+1,grid);

    return grid;
}

export default new Day18;