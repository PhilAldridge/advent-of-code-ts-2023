import { Day } from "../day";

class Day17 extends Day {

    constructor(){
        super(17);
    }
    doneList:done[] =[];

    solveForPartOne(input: string): string {
        const lines = input.split('\n');
        const totalRows = lines.length;
        const totalCols = lines[0].length;
        let paths: path3[] = [{string:'', rowI:0,colI:0, score:0}];
        while(paths[0].rowI !== totalRows-1 || paths[0].colI !== totalCols-1){
            paths = this.branch(paths, lines);
        }
        console.log(paths[0])
        return paths[0].score.toString()
    }

    solveForPartTwo(input: string): string {
        const lines = input.split('\n');
        const totalRows = lines.length;
        const totalCols = lines[0].length;
        this.doneList=[];
        let paths: path3[] = [{string:'', rowI:0,colI:0, score:0}];
        while(paths[0].rowI !== totalRows-1 || paths[0].colI !== totalCols-1){
            paths = this.branchU(paths, lines);
        }
        console.log(paths[0])
        return paths[0].score.toString()
    }
    branch = (paths:path3[], lines:string[]):path3[] =>{
        paths = paths.concat(this.addAllDirections(paths[0],lines));
        paths.shift();
        paths.sort((a,b)=>a.score-b.score);
        
        return paths;
    }
    branchU = (paths:path3[], lines:string[]):path3[] =>{

    }

    addAllDirections = (path:path3, lines:string[]):path3[] => {
        let newPaths = [
            this.addDirection(path,lines,'U'),
            this.addDirection(path,lines,'D'),
            this.addDirection(path,lines,'L'),
            this.addDirection(path,lines,'R'),
        ];
        return newPaths.filter(path=>path) as path3[];
    }
    
    addDirection = (path:path3, lines:string[], direction:string):path3|null =>{
        let lineChange=0, colChange=0;
        switch (direction) {
            case 'U':
                lineChange=-1; break;
            case 'D':
                lineChange=1; break;
            case 'L':
                colChange=-1; break;
            case 'R':
                colChange=1; break;
        }
        const newRow = path.rowI+lineChange;
        const newCol = path.colI+colChange;
        if(oppositeDirection(path.string,direction) 
            || newCol<0 
            || newRow<0 
            || newRow>=lines.length
            || newCol>=lines[0].length) return null;
        
        if(this.doneList.some(done=>done.colI===newCol && done.rowI===newRow &&done.direction===direction)) {
            return null;
        }
        if(path.string.substring(path.string.length-3)===direction.repeat(3)) return null;
        if(path.string.substring(path.string.length-1)!==direction){
            this.doneList.push({
                rowI:newRow,
                colI:newCol,
                direction:direction
            })
        }
        return {
            rowI:newRow,
            colI:newCol,
            score:path.score + Number(lines[newRow][newCol]),
            string:path.string+direction
        }
    }
}

export default new Day17;





function oppositeDirection (route:string, nextDirection:string): boolean {
    if(route==='') return false;
    const directions = ['R', 'D', 'L', 'U']
    const lastChar = route.substring(route.length-1);
    const index1= (directions.indexOf(lastChar)+2)%4;
    const index2 = directions.indexOf(nextDirection);
    return index1===index2
}

type path3 = {
    string:string
    rowI:number
    colI:number
    score:number
}

type done = {
    rowI:number
    colI:number
    direction:string
}