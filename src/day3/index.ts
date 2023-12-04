import { Day } from "../day";

type numberLocation = {
    number:number
    location: number[]
    length: number
}

type coordinates = string

class Day3 extends Day {

    constructor(){
        super(3);
    }

    solveForPartOne(input: string): string {
        const symbolLocations = getSymbolLocations(input);
        const numberLocations = getNumberLocations(input);
        let total =0;
        numberLocations.forEach(numberLocation => {
            let symbolNearby = false;
            for (let i = -1; i<=1; i++){
                for(let j = -1; j<= numberLocation.length;j++){
                    const locationToCheck = [numberLocation.location[0]+i,numberLocation.location[1]+j];
                    if(symbolLocations.includes(JSON.stringify(locationToCheck))){
                        if(numberLocation.number===505) console.log(locationToCheck)
                        symbolNearby = true;
                    }
                }
            }
            if(symbolNearby) {
                //console.log(numberLocation.number)
                total += numberLocation.number;
            }
        })
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        const asteriskLocations = getAsteriskLocations(input);
        const numberLocations = getNumberLocations(input);
        let total = 0;
        asteriskLocations.forEach(asteriskLocation=> {
            let adjacentNumbers: numberLocation[] = [];
            numberLocations.forEach(numberLocation => {
                if(
                    (numberLocation.location[0] >= asteriskLocation[0]-1 && numberLocation.location[0] <= asteriskLocation[0]+1) 
                    &&
                    (numberLocation.location[1]+numberLocation.length >= asteriskLocation[1] && numberLocation.location[1] <= asteriskLocation[1]+1)
                ) {
                    adjacentNumbers.push(numberLocation);
                }
            })
            console.log(adjacentNumbers)
            if(adjacentNumbers.length===2) {
                total += adjacentNumbers[0].number*adjacentNumbers[1].number
            }
        })
        return total.toString();
    }
}

export default new Day3;

function getSymbolLocations(input:string):coordinates[] {
    const lines = input.replace('\r',"").split('\n');
    let symbolLocations: string[] = [];
    const allowedCharacters = ['0','1','2','3','4','5','6','7','8','9','.']
    lines.forEach((line,index)=>{
        line = line.replace(/[^\x00-\x7F]/g, "");
        for(let j=0; j<line.length-1;j++){
            if(!allowedCharacters.includes(line[j])) {
                symbolLocations.push(JSON.stringify([index,j]))
                if(j===140) console.log([index,j])
            }
        }
    })
    return symbolLocations;
}


function getNumberLocations(input:string):numberLocation[] {
    const lines = input.split('\n');
    let numberLocations: numberLocation[] = [];

    lines.forEach((line,index)=>{
        const numbers =  line.matchAll(/\d+/g);
        [...numbers].forEach(number => {
            numberLocations.push({
                number: Number(number[0]),
                location: [index, number.index as number],
                length: number[0].length
            })
        })
    })
    return numberLocations;
}

function getAsteriskLocations(input:string):number[][] {
    const lines = input.split('\n');
    let asteriskLocations: number[][] = [];

    lines.forEach((line,index)=>{
        const asterisks =  line.matchAll(/\*/g);
        
        [...asterisks].forEach(number => {
            asteriskLocations.push(
                [index, number.index as number])
        })
    })
    console.log(asteriskLocations)
    return asteriskLocations;
}