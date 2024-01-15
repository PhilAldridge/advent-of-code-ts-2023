import day25 from './index';

describe('On Day 25', () =>{
    it(`part1 is identity function`, ()=>{
        expect(day25.solveForPartOne('hello')).toBe('hello');
    })
});