import { Day } from "../day";

class Day17 extends Day {

    constructor(){
        super(17);
    }
    doneList:done[] =[];

    solveForPartOne(input: string): string {
        /*const lines = input.split('\n');
        const totalRows = lines.length;
        const totalCols = lines[0].length;
        let paths: path3[] = [{string:'', rowI:0,colI:0, score:0}];
        while(paths[0].rowI !== totalRows-1 || paths[0].colI !== totalCols-1){
            paths = this.branch(paths, lines);
        }
        return paths[0].score.toString()*/
        return ''
    }

    paths:path3[] = [{string:'', rowI:0,colI:0, score:0}];

    solveForPartTwo(input: string): string {
        const lines = input.split('\n');
        const totalRows = lines.length;
        const totalCols = lines[0].length;
        this.doneList=[];
        //let paths: path3[] = [{string:'', rowI:0,colI:0, score:0}];
        while(this.paths[0].rowI !== totalRows-1 || this.paths[0].colI !== totalCols-1){
            this.paths = this.branchU(this.paths, lines);
            console.log(this.paths[0])
        }
        console.log(this.paths[0])
        return this.paths[0].score.toString()
    }

    branch = (paths:path3[], lines:string[]):path3[] =>{
        paths = paths.concat(this.addAllDirections(paths[0],lines));
        paths.shift();
        paths.sort((a,b)=>a.score-b.score);
        
        return paths;
    }
    branchU = (paths:path3[], lines:string[]):path3[] =>{
        paths = paths.concat(this.addAllDirectionsU(paths[0],lines))
        paths.shift();
        paths.sort((a,b)=>a.score-b.score);
        return paths;
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

    addAllDirectionsU = (path:path3, lines:string[]):path3[] => {
        let newPaths = [
            ...this.addDirectionU(path, lines,'U'),
            ...this.addDirectionU(path, lines,'D'),
            ...this.addDirectionU(path, lines,'L'),
            ...this.addDirectionU(path, lines,'R'),
        ]
        return newPaths;
    }

    addDirectionU = (path:path3, lines:string[], direction:string):path3[] => {
        let newPaths:path3[]=[];
        if(oppositeDirection(path.string,direction) || path.string.endsWith(direction)) {
            return []
        }
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
        let newScore = path.score
        for(let i=1;i<=10;i++){
            const newRow = path.rowI+lineChange*i;
            const newCol = path.colI+colChange*i;
            if(newCol<0 
                || newRow<0 
                || newRow>=lines.length
                || newCol>=lines[0].length) {
                    break;
            }
            
            newScore += Number(lines[newRow][newCol])
            if(i<4) continue;
            const done = this.doneList.find(done=>done.colI===newCol && done.rowI===newRow &&done.direction===direction)
            if(done) {
                if(done.score<=newScore) continue;
                done.score = newScore;
            } else {
                this.doneList.push({
                    rowI:newRow,
                    colI:newCol,
                    direction:direction,
                    score:newScore
                })
            }
            newPaths.push({
                rowI:newRow,
                colI:newCol,
                score:newScore,
                string:path.string+direction.repeat(i)
            })
        }
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
                direction:direction,
                score:path.score + Number(lines[newRow][newCol])
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
    score:number
}