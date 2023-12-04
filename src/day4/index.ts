import { Day } from "../day";

class Day4 extends Day {

    constructor(){
        super(4);
    }

    solveForPartOne(input: string): string {
        const cards = parseCards(input)
        let total = 0;
        cards.forEach(card=>{
            let matches = 0
            card.winningNumbers.forEach(num=>{
                if(card.yourNumbers.includes(num)) matches++;
            })
            if(matches >=1){ total += Math.pow(2,matches-1);}
        } )
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        let total = 0;
        const cards = parseCards(input);
        cards.forEach((card,index)=> {
            let matches = 0
            card.winningNumbers.forEach(num=>{
                if(card.yourNumbers.includes(num)) matches++;
            })
            for(let i=0; i<matches; i++){
                if(index+i+1< cards.length) {
                    cards[index+i+1].copies += card.copies;
                }
            }
            total += card.copies
        })
        return total.toString();
    }
}

export default new Day4;

type card = {
    cardNo: number
    winningNumbers: number[]
    yourNumbers:number[]
    copies : number
}

function parseCards(input: string): card[] {
    let cards: card[] = []
    const lines = input.split('\n');
    lines.forEach((line,index)=>{
        const lineWithoutCardNo = line.split(':')[1];
        const winningString = lineWithoutCardNo.split('|')[0];
        const yourString = lineWithoutCardNo.split('|')[1];
        const winningNumbers = winningString.split(' ').map(str=> Number(str)).filter(num=>num!==0)
        const yourNumbers = yourString.split(' ').map(str=>Number(str)).filter(num=> num!==0)
        cards.push({
            cardNo: index+1,
            winningNumbers: winningNumbers,
            yourNumbers: yourNumbers,
            copies: 1
        })
    })
    return cards;
}