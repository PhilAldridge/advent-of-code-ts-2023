import { Day } from "../day";

class Day5 extends Day {

    constructor(){
        super(5);
    }

    solveForPartOne(input: string): string {
        const mapping = parseMapping(input)
        return Math.min(...mapping.map(map=>map.location)).toString();
    }

    solveForPartTwo(input: string): string {
        let maps: mapArray[][] = getMaps(input);
        const seeds = getSeedRanges(input);
        let minLocation = 0;
        while(true) {
            let to = minLocation;
            maps.forEach(map=>{
                to = traverseMapBackwards(to,map);
            })
            if(seedAtLocation(to,seeds)) {
                return minLocation.toString();
            } else{
                minLocation ++;
            }
        }
    }
}

export default new Day5;

function seedAtLocation(seed:number, maps: mapArray[]):boolean {
    for(let i=0;i<maps.length;i++){
        if(seed>= maps[i].to && seed<maps[i].to + maps[i].range) {
            return true;
        }
    }
    return false;
}

function traverseMapBackwards(to:number, maps: mapArray[]):number {
    for(let i=0;i<maps.length;i++){
        if(to>= maps[i].to && to<maps[i].to + maps[i].range) {
            return maps[i].from + to - maps[i].to;
        }
    }
    return to;
}

function getSeedRanges(input:string):mapArray[] {
    let result:mapArray[] = [];
    const sections = input.split('\r\n\r\n');
    const numberArray = sections[0].match(/\d+/g)?.map(str=> Number(str));
    if(!numberArray) throw new Error("can't find any numbers!");
    for(let i=0; i<numberArray.length/2; i++) {
        result.push({
            from: 0,
            to: Number(numberArray[2*i]),
            range: Number(numberArray[2*i+1])
        })
    }
    return result;
}

function parseMapping(input:string) :seedMapping[] {
    const sections = input.split('\r\n\r\n');
    let mapping: seedMapping[] = [];
    mapSeeds(sections[0],mapping)
    mapNumbers(sections[1],"seed","soil",mapping)
    mapNumbers(sections[2],"soil","fertilizer", mapping);
    mapNumbers(sections[3],"fertilizer","water",mapping);
    mapNumbers(sections[4],"water","light",mapping);
    mapNumbers(sections[5],"light","temperature",mapping);
    mapNumbers(sections[6],"temperature","humidity",mapping);
    mapNumbers(sections[7],"humidity","location",mapping);
    return mapping;
}

function mapSeeds(numbers:string, mapping:seedMapping[]) {
    const numberArray = numbers.match(/\d+/g)?.map(str=> Number(str));
    numberArray?.forEach(num=> {
        let newObj: seedMapping = {};
        newObj["seed"] = num;
        mapping.push(newObj)
    })
}

function getMaps(input:string):mapArray[][] {
    const sections = input.split('\r\n\r\n');
    let maps:mapArray[][]=[]
    for(let i=7;i>0;i--){
        maps.push(getMap(sections[i]))
    }
    
    return maps;
}

function getMap(numbers:string):mapArray[]{
    const numberArray = numbers.match(/\d+/g);
    let numberArrayMap: mapArray[] = [];
    if(!numberArray) throw new Error("can't find any numbers!");
    for(let i=0; i<numberArray.length/3; i++) {
        numberArrayMap.push({
            from: Number(numberArray[3*i+1]),
            to: Number(numberArray[3*i]),
            range: Number(numberArray[3*i+2])
        })
    }
    return numberArrayMap.sort((a,b)=>a.from-b.from)
}

function mapNumbers(numbers:string, from:string, to:string, mapping:seedMapping[]) {
    const numberArrayMap = getMap(numbers)
    
    mapping.forEach(seedMap=> {
        if(!seedMap[from]) return;
        const match = numberArrayMap.find(map=>{
           return seedMap[from] >= map.from && seedMap[from] < map.from + map.range
        })
        if(!match){
            seedMap[to] = seedMap[from];
            return;
        }
        seedMap[to] = match.to + seedMap[from] - match.from;
    })
}

type seedMapping = {
    [key:string]: number
}

type mapArray = {
    from: number
    to:number
    range: number
    branch?: mapArray[]
}