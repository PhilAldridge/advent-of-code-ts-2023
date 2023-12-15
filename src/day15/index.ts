import { Day } from "../day";

class Day15 extends Day {

    constructor(){
        super(15);
    }

    solveForPartOne(input: string): string {
        const parts = input.split(',')
        let total = 0;
        parts.forEach(part=>{
            total += runHash(part)
        })
        return  total.toString();
    }

    solveForPartTwo(input: string): string {
        const parts = input.split(',');
        let boxes: box[] = [];
        parts.forEach(part=>{
            boxes = runOperation(part,boxes);
        })
        let total = 0;
        boxes.forEach((box)=>{
            box.lenses.forEach((lense, lenseI)=> {
                const focussingPower = (box.number + 1)*(lenseI + 1)*lense.focalLength;
                total += focussingPower;
            })
        })

        return total.toString();
    }
}

export default new Day15;

function runHash(part:string): number{
    let result = 0;
    for(let i=0;i<part.length;i++){
        result+= part.charCodeAt(i);
        result*= 17;
        result = result % 256
    }
    return result;
}

function runOperation(part:string, boxes: box[]):box[]{
    if(part.includes('-')) {
        const split = part.split('-');
        const label = split[0];
        return removeLens(label, runHash(label), boxes)
    } else {
        const split = part.split('=');
        const label = split[0];
        const focalLength = Number(split[1]);
        return addLens(label, focalLength, runHash(label),boxes)
    }

}

function removeLens(label:string, boxNo:number, boxes:box[]):box[] {
        const box = boxes.find(box=>box.number === boxNo);
        if(!box) return boxes;
        const lensIndex = box.lenses.findIndex(lens=>lens.label === label);
        if(lensIndex===-1) return boxes;
        box.lenses.splice(lensIndex,1);
        return boxes;
}

function addLens(label:string, focalLength:number, boxNo:number, boxes:box[]):box[] {
    const box = boxes.find(box=>box.number === boxNo);
    if(!box) {
        boxes.push({
            number: boxNo,
            lenses: [{
                label: label,
                focalLength: focalLength
            }]
        })
        return boxes;
    }
    const lensIndex = box.lenses.findIndex(lens=>lens.label === label);
    if(lensIndex===-1) {
        box.lenses.push({
            label:label,
            focalLength:focalLength
        })
        return boxes;
    }
    box.lenses[lensIndex].focalLength = focalLength;
    return boxes;
}

type lens={
    label:string,
    focalLength:number
}

type box ={
    number:number
    lenses:lens[]
}