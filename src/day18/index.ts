import { Day } from "../day";

class Day18 extends Day {

    constructor(){
        super(18);
    }

    solveForPartOne(input: string): string {
        const lines = input.split('\n');
        const commands:command[] = [];
        lines.forEach(line=>{
            const split = line.split(' ');
            commands.push({
                direction: split[0],
                amount: Number(split[1])
            })
        })
        const vertices = getVertices(commands);
        let total = calcPolygonArea(vertices)
        //46334
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        const lines = input.split('\n');
        const commands:command[] = [];
        const directions = ['R', 'D', 'L', 'U']
        lines.forEach(line=>{
            const split = line.split(' ')[2];
            const directionDigit = split[split.length-2];
            const directionChar = directions[Number(directionDigit)]
            const amountHex = split.substring(2,split.length-2);
            const amountDec = parseInt(amountHex,16);
            commands.push({
                direction: directionChar,
                amount: amountDec
            })
        })
        //console.log(commands)
        const vertices = getVertices(commands);
        let total = calcPolygonArea(vertices)
        return total.toString();
    }
}

function getVertices(commands:command[]):vertex[] {
    let position = {
        x:0,
        y:0
    };
    let vertices:vertex[] = [{x:0,y:0}];
    commands.forEach(command=>{
        switch(command.direction) {
            case 'U':
                position.y -= command.amount;
                break;
            case 'D':
                position.y += command.amount;
                break;
            case 'L':
                position.x -= command.amount;
                break;
            case 'R':
                position.x += command.amount;
                break;
        }
        vertices.push({
            x:position.x,
            y:position.y
        })
    });
    return vertices;
}

function calcPolygonArea(vertices:vertex[]):number {
    var total = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
      var addX = vertices[i].x;
      var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
      var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
      var subY = vertices[i].y;

      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
      if(i!==0) {
        if(vertices[i].x>vertices[i-1].x) total+= vertices[i].x-vertices[i-1].x;
        if(vertices[i].y>vertices[i-1].y) total += vertices[i].y-vertices[i-1].y
      }
    }

    return Math.abs(total)+1;
}

type vertex = {
    x:number
    y:number
}

type command = {
    direction: string
    amount: number
}
export default new Day18;