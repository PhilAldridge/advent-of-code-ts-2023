import { Day } from "../day";

class Day14 extends Day {

    constructor(){
        super(14);
    }

    solveForPartOne(input: string): string {
        const rows = input.split('\n');
        const tiltedRows = tiltNorth(rows);
        let total = 0;
        tiltedRows.forEach((row,i)=>{
            const boulderCount = (row.match(/O/g) ||[]).length;
            total += boulderCount*(tiltedRows.length-i)
        })
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        let rows = input.split('\n');
        //supposed to go to 1000000000 but you get in a repeat after some time
        for(let i=0;i<1000;i++) {
            rows = tiltCycle(rows)
        }

        let total =0;
        rows.forEach((row,i)=>{
            const boulderCount = (row.match(/O/g) ||[]).length;
            total += boulderCount*(rows.length-i)
        })

        return total.toString();
    }
}

export default new Day14;

function tiltCycle(rows:string[]):string[] {
    return tiltEast(tiltSouth(tiltWest(tiltNorth(rows))))
}

function tiltNorth(rows:string[]):string[] {
    var tiltedRows: string[] = JSON.parse(JSON.stringify(rows))
    while(true) {
        let movement = false;
        for(let i=1;i<rows.length;i++) {
            for(let j=0;j<rows[i].length;j++) {
                if(tiltedRows[i][j]==='O' && tiltedRows[i-1][j]==='.') {
                    tiltedRows[i-1] = tiltedRows[i-1].substring(0,j)+'O'+tiltedRows[i-1].substring(j+1);
                    tiltedRows[i] = tiltedRows[i].substring(0,j)+'.'+tiltedRows[i].substring(j+1);
                    movement = true
                }
            }
        }
        if(!movement) {
            return tiltedRows;
        } 
    }
}

function tiltSouth(rows:string[]):string[] {
    var tiltedRows: string[] = JSON.parse(JSON.stringify(rows))
    while(true) {
        let movement = false;
        for(let i=0;i<rows.length-1;i++) {
            for(let j=0;j<rows[i].length;j++) {
                if(tiltedRows[i][j]==='O' && tiltedRows[i+1][j]==='.') {
                    tiltedRows[i+1] = tiltedRows[i+1].substring(0,j)+'O'+tiltedRows[i+1].substring(j+1);
                    tiltedRows[i] = tiltedRows[i].substring(0,j)+'.'+tiltedRows[i].substring(j+1);
                    movement = true
                }
            }
        }
        if(!movement) {
            return tiltedRows;
        } 
    }
}

function tiltEast(rows:string[]):string[] {
    var tiltedRows: string[] = JSON.parse(JSON.stringify(rows))
    while(true) {
        let movement = false;
        for(let i=0;i<rows.length;i++) {
            for(let j=0;j<rows[i].length-1;j++) {
                if(tiltedRows[i][j]==='O' && tiltedRows[i][j+1]==='.') {
                    tiltedRows[i] = tiltedRows[i].substring(0,j)+'.O'+tiltedRows[i].substring(j+2);
                    movement = true
                }
            }
        }
        if(!movement) {
            return tiltedRows;
        } 
    }
}

function tiltWest(rows:string[]):string[] {
    var tiltedRows: string[] = JSON.parse(JSON.stringify(rows))
    while(true) {
        let movement = false;
        for(let i=0;i<rows.length;i++) {
            for(let j=1;j<rows[i].length;j++) {
                if(tiltedRows[i][j]==='O' && tiltedRows[i][j-1]==='.') {
                    tiltedRows[i] = tiltedRows[i].substring(0,j-1)+'O.'+tiltedRows[i].substring(j+1);
                    movement = true
                }
            }
        }
        if(!movement) {
            return tiltedRows;
        } 
    }
}