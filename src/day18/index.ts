import { Day } from "../day";

class Day18 extends Day {

    constructor(){
        super(18);
    }

    solveForPartOne(input: string): string {
        const lines = input.split('\n');
        let grid:string[]= new Array(1000).fill(' '.repeat(1000));
        let position = [237,400];
        const startPos = [position[0]+1,position[1]+1]
        grid[position[0]]=grid[position[0]].substring(0,position[1]) + '#' + grid[position[0]].substring(position[1]+1)
        
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
        let placesToGrow = [startPos];
        console.log(grid)
        while(placesToGrow.length>0) {
            let nextPlaces: [number,number][] = [];
            placesToGrow.forEach(placeToGrow=>{
                const result = growLake(placeToGrow[0],placeToGrow[1],grid)
                if(result)
                nextPlaces = nextPlaces.concat(result)
            })
            placesToGrow = nextPlaces;
        }
        //console.log(grid)
        grid.forEach(line=>{
            total += (line.match(/#/g)||[]).length;
        })
        //46334
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        return input;
    }
}

function growLake(lineI:number, colI:number, grid: string[]):[number,number][] |null {
    if(grid[lineI][colI]==='#') return null;
    let result:[number,number][]=[]
    grid[lineI] = grid[lineI].substring(0,colI) + '#' + grid[lineI].substring(colI+1)
    if(lineI!== 0 && grid[lineI-1][colI]!=='#') result.push([lineI-1,colI]);
    if(lineI!== grid.length-1 && grid[lineI+1][colI]!=='#') result.push([lineI+1,colI]);
    if(colI!==0 && grid[lineI][colI-1]!=='#') result.push([lineI,colI-1]);
    if(colI!== grid[0].length-1 && grid[lineI][colI+1]!=='#') result.push([lineI,colI+1]);

    return result;
}

function calcPolygonArea(vertices:vertex[]) {
    var total = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
      var addX = vertices[i].x;
      var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
      var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
      var subY = vertices[i].y;

      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
}

type vertex = {
    x:number
    y:number
}

export default new Day18;