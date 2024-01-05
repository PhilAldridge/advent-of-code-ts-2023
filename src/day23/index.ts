import { Day } from "../day";

class Day23 extends Day {

    constructor(){
        super(23);
    }

    solveForPartOne(input: string): string {
        const rows = input.split('\n');
        let graph: GraphNode[] = [{
            position:[0,rows[0].indexOf('.')],
            paths:[]
        }]
        for(let i=0; i<graph.length; i++){
            [graph[i].paths, graph] = getPaths(graph[i].position, rows, graph);
        }
        const routes = getRoutes(graph,[[0,1],graph[0].paths[0].distance]);
        const distances = (routes.map(route=>route[1]+1))

        return Math.max(...distances).toString();
    }

    solveForPartTwo(input: string): string {
        const rows = input.replace(/[<>^v]/g, ".").split('\n');
        let graph: GraphNode[] = [{
            position:[0,rows[0].indexOf('.')],
            paths:[]
        }]
        for(let i=0; i<graph.length; i++){
            [graph[i].paths, graph] = getPaths(graph[i].position, rows, graph);
        }
        const routes = getRoutes(graph,[[0,1],graph[0].paths[0].distance]);
        let max = 0;
        routes.forEach(route=>{
            if(route[1]>max) max = route[1]
        })
        return (max+1).toString();
    }
}

export default new Day23;

function getRoutes(graph:GraphNode[], currentRoute:[number[],number]):[routes:number[],distance:number][]{
    let routes:[number[],number][]=[];
    const currentIndex = currentRoute[0][currentRoute[0].length-1]
    if(currentIndex === graph.length-1) return [currentRoute]
    graph[currentIndex].paths.forEach(path=>{
        if(!currentRoute[0].includes(path.destinationIndex)){
            routes=[...routes, ...getRoutes(graph, [[...currentRoute[0],path.destinationIndex],currentRoute[1]+path.distance] )]
        }
        
    })

    return routes;
}

function getPaths(start:[number,number], rows:string[], graph:GraphNode[]):[paths:Path[],graph:GraphNode[]]{
    let paths:Path[]=[];
    const endPos = rows[rows.length-1].indexOf('.');
    let newDirections = traverse(rows,[start]);
    for(const direction of newDirections){
        let path = [start,direction]
        let done=false;
        let blocked=false;
        while(!done) {
            const next = traverse(rows,path);
            if(next.length===0) {
                done = true;
                blocked = true;
            } else if(next.length>1 || (next[0][0]===rows.length-1 && next[0][1]===endPos)) {
                done = true;
            } else {
                path.push(next[0])
            }
        }
        if(blocked) continue;
        const [finalY, finalX] = path[path.length-1];
        const index = graph.findIndex(graphNode=>graphNode.position[0]===finalY && graphNode.position[1]===finalX);
        if(index===-1){
            graph.push({
                position:path[path.length-1],
                paths:[]
            })
            paths.push({
                distance:path.length-1,
                destinationIndex:graph.length-1
            })
        } else {
            paths.push({
                distance:path.length-1,
                destinationIndex:index
            })
        }
    }
    
    return [paths,graph]
}

function traverse(rows:string[], pathSoFar:[number,number][]): [number,number][]{
    const [rowI, colI] = pathSoFar[pathSoFar.length-1]
    let nextSquare: [number,number][]=[];
    if(rowI!== 0 &&
        (rows[rowI][colI]==="." || rows[rowI][colI]==="^") &&
        rows[rowI-1][colI] !== "#"){
            nextSquare.push([rowI-1,colI])
        }
    if(rowI!== rows.length-1 &&
        (rows[rowI][colI]==="." || rows[rowI][colI]==="v") &&
        rows[rowI+1][colI] !== "#"){
            nextSquare.push([rowI+1,colI])
        }
    if(colI!== 0 &&
        (rows[rowI][colI]==="." || rows[rowI][colI]==="<") &&
        rows[rowI][colI-1] !== "#"){
            nextSquare.push([rowI,colI-1])
        }
    if(colI!== rows[0].length-1 &&
        (rows[rowI][colI]==="." || rows[rowI][colI]===">") &&
        rows[rowI][colI+1] !== "#"){
            nextSquare.push([rowI,colI+1])
        }
    nextSquare = nextSquare.filter(square=>!pathSoFar.some(postion=>postion[0]===square[0] && postion[1]===square[1]));
    return nextSquare;
}

type GraphNode = {
    position: [number,number]
    paths: Path[]
}

type Path = {
    distance:number
    destinationIndex:number
}