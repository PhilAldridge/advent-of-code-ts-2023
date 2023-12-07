import { Day } from "../day";

class Day7 extends Day {

    constructor(){
        super(7);
    }

    solveForPartOne(input: string): string {
        let hands = parseHands(input, 11);
        hands = hands.sort((a,b)=>compareHands(a,b));
        let total = 0;
        hands.forEach((hand,i)=> {
            total += hand.bid*(i+1);
        })
        return total.toString();
    }

    solveForPartTwo(input: string): string {
        let hands = parseHands(input, 0);
        hands = hands.sort((a,b)=>compareHands(a,b));
        let total = 0;
        hands.forEach((hand,i)=> {
            total += hand.bid*(i+1);
        })
        return total.toString();
    }
}

export default new Day7;

function parseHands(input:string, jackScore:number):hand[]{
    const handStrings = input.split('\n');
    let hands: hand[] = [];
    handStrings.forEach(handString=>{
        const cardsUnformatted = [...handString.split(' ')[0]];
        const cards = formatCards(cardsUnformatted, jackScore);
        const bid = Number(handString.split(' ')[1]);
        hands.push({
            bid:bid,
            cards:cards,
            counter: countCards(cards)
        })
    })

    return hands;
}

function formatCards(cardsUnformatted:string[], jackScore: number):number[] {
    let cards :number[] = [];
    cardsUnformatted.forEach(char=>{
        switch (char) {
            case 'A':
                cards.push(14);
                break;
            case 'K':
                cards.push(13);
                break;
            case 'Q':
                cards.push(12);
                break;
            case 'J':
                cards.push(jackScore);
                break;
            case 'T':
                cards.push(10);
                break;
            default:
                cards.push(Number(char))

        }
    })
    return cards;
}

function countCards(cards:number[]):Map<number,number> {
    let counter = new Map<number, number>();
    const sortedCards = [...cards].sort((a,b)=>b-a);
    sortedCards.forEach(card=> {
        if(card===0) {
            if(counter.size===0) {
                counter.set(0,1);
            } else {
                const [key,value] = ([...counter.entries()].reduce((a, e ) => e[1] > a[1] ? e : a));
                counter.set(key, value + 1);
            }
            
        } else if(counter.has(card)) {
            counter.set(card, counter.get(card) as number +1)
        } else {
            counter.set(card,1)
        }
    })
    return counter;
}

function compareHands(hand1:hand, hand2:hand):number {
    const matches1 = getMatches(hand1.counter);
    const matches2 = getMatches(hand2.counter);
    if(matches1[0]===matches2[0]) {
        if(matches1[1]===matches2[1]) {
            return hand1.cards.reduce((a,c)=>a*100+c, 0) - hand2.cards.reduce((a,c)=>a*100+c, 0);
        }
        return matches1[1]-matches2[1];
    }
    return matches1[0]-matches2[0];
}

function getMatches(counter:Map<number,number>):number[] {
    const matches = Array.from(counter.values()).sort((a,b)=>b-a);
    return matches.slice(0,2);
}

type hand = {
    bid: number
    cards: number[]
    counter:Map<number,number>
}