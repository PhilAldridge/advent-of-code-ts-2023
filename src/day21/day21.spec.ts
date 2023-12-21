import day21 from './index';

describe('On Day 21', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day21.solveForPartOne('hello')).toBe('hello');
    })
});