import { Day } from "../day";

class Day25 extends Day {

    constructor(){
        super(25);
    }

    solveForPartOne(input: string): string {
        let graph = new Graph();
        input.split('\n').forEach(line => {
            const [node1,rest] = line.split(': ');
            graph.addNode(node1)
            const restNodes = rest.split(' ')
            restNodes.forEach(node2=>{
                graph.addNode(node2)
                graph.addEdge(node1,node2)
                
            })
        })
        for(let i=0;i<100;i++){
            console.log(karger(graph))
        }
        return 'input';
    }

    solveForPartTwo(input: string): string {
        return' input';
    }
}

class Graph { 
    adjacencyList: Map<string,Set<string>>;
    edgeList: [string,string][]
  
    constructor(){ 
      this.adjacencyList = new Map();
      this.edgeList = [];
    }
  
    addNode(node:string){
        if(!this.adjacencyList.has(node)) this.adjacencyList.set(node, new Set()); 
    }
  
    addEdge(node1:string, node2:string){ 
      this.adjacencyList.get(node1)?.add(node2); 
      this.adjacencyList.get(node2)?.add(node1); 
      this.edgeList.push([node1,node2]);
    }

    removeEdge(node1:string, node2:string) {
        this.adjacencyList.get(node1)?.delete(node2)
        this.adjacencyList.get(node2)?.delete(node1)
    }
  
    getNeighboors(node:string){ 
      return this.adjacencyList.get(node); 
    }
  
    hasEdge(node1:string, node2:string){ 
      return this.adjacencyList.get(node1)?.has(node2); 
    }

    getRandomNodes() {
        return this.edgeList[Math.floor(Math.random()*this.edgeList.length)]
    }
  }

  function contractNodes(graph: Graph, node1:string, node2:string): Graph {
    let contractedGraph = new Graph();
    for(let [key,value] of graph.adjacencyList) {
        if(key === node1 || key===node2) {
            key = node1+node2;
        }
        for(let endNode of value) {
            if(endNode === node1 || endNode === node2) {
                endNode = node1+node2;
            }
            if(key !== endNode) {
                contractedGraph.addNode(key);
                contractedGraph.addNode(endNode);
                contractedGraph.addEdge(key,endNode);
            }
        }
    }
    return contractedGraph;
  }

function karger(graph:Graph): string[] {
    while(graph.adjacencyList.size>2){
        const [node1, node2] = graph.getRandomNodes();
        graph = contractNodes(graph, node1,node2);
    }
    return Array.from(graph.adjacencyList.keys());
}
 

export default new Day25;