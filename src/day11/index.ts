import { Day } from "../day";

class Day11 extends Day {

    constructor(){
        super(11);
    }

    solveForPartOne(input: string): string {
        const universe = getExpandedUniverse(input);
        const galaxies = getGalaxyLocations(universe);
        let total = 0;
        galaxies.forEach((galaxy1,i1)=>{
            galaxies.forEach((galaxy2,i2) => {
                const distance = Math.abs(galaxy1[0]-galaxy2[0]) + Math.abs(galaxy1[1]-galaxy2[1]);
                total += Math.abs(galaxy1[0]-galaxy2[0]) + Math.abs(galaxy1[1]-galaxy2[1])
            })
        })
        total /= 2;
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        const universe = getUnexpandedUniverse(input);
        const emptyRows = getEmptyRows(universe);
        const emptyCols = getEmptyCols(universe);
        const galaxies = getGalaxyLocations(universe);
        let total = 0;
        galaxies.forEach((galaxy1,i1)=>{
            galaxies.forEach((galaxy2,i2) => {
                let distance = Math.abs(galaxy1[0]-galaxy2[0]) + Math.abs(galaxy1[1]-galaxy2[1]);
                for(let i = Math.min(galaxy1[0],galaxy2[0]); i<Math.max(galaxy1[0],galaxy2[0]);i++) {
                    if(emptyRows.includes(i)) distance += 1000000-1
                }
                for(let i = Math.min(galaxy1[1],galaxy2[1]); i<Math.max(galaxy1[1],galaxy2[1]);i++) {
                    if(emptyCols.includes(i)) distance += 1000000-1
                }
                total+= distance
            })
        })
        total /= 2;
        return total.toString();
    }
}

export default new Day11;

function getExpandedUniverse(input:string):string[][] {
    const lines = input.split('\n');
        let emptyColumns = new Array(lines[0].length).fill(true);
        let universe:string[][] = [];

        lines.forEach(line=>{
            const lineSplit = line.split('');
            universe.push(lineSplit)
            lineSplit.forEach((point,index)=>{
                if(point==="#") emptyColumns[index] = false;
            })
            if(!line.includes('#')){
                universe.push(lineSplit)
            }
        })
        
        for(let i=emptyColumns.length-1;i>=0;i--){
            let universe2:string[][] = [];
            universe.forEach(row=>{
                if(emptyColumns[i]) {
                    universe2.push( [...row.slice(0,i),'.',...row.slice(i)])
                } else {
                    universe2.push(row)
                }
            })
            universe = universe2;
        }
        return universe;
}

function getUnexpandedUniverse(input:string):string[][]{
    const lines = input.split('\n');
    let universe:string[][] = [];
    lines.forEach(line => {
        const lineSplit = line.split('');
        universe.push(lineSplit);
    });
    return universe;
}

function getEmptyRows(universe:string[][]):number[] {
    let rows:number[] = [];
    universe.forEach((r,i)=>{
        if(!r.includes('#')) rows.push(i)
    })
    return rows;
}

function getEmptyCols(universe:string[][]):number[] {
    let colEmpty = new Array(universe[0].length).fill(true);
    universe.forEach(row=>{
        row.forEach((col,i)=>{
            if(col==='#') colEmpty[i] = false;
        })
    })
    let results:number[]=[];
    colEmpty.forEach((col,i)=>{
        if(col) results.push(i)
    })
    return results;
}

function getGalaxyLocations(universe:string[][]):[number,number][] {
    let locations:[number,number][] = [];
    universe.forEach((row,rowIndex)=>{
        row.forEach((col,colIndex)=>{
            if(col==='#') locations.push([rowIndex,colIndex])
        })
    })
    return locations;
}