class Map_Node {
    name: L.LatLng;
    x: number;
    y: number
    constructor(name: L.LatLng, x: number, y: number) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.gScore = Number.POSITIVE_INFINITY;
      this.fScore = Number.POSITIVE_INFINITY;
      this.previous = null;
      this.neighbors = [];
    }
  }
  
  function heuristic(current, goal) {
    return Math.abs(current.x - goal.x) + Math.abs(current.y - goal.y);
  }
  
  function distance(Map_Node1, Map_Node2) {
    return Math.abs(Map_Node1.x - Map_Node2.x) + Math.abs(Map_Node1.y - Map_Node2.y);
  }
  
  function aStar(start, goal) {
    var openSet = new Set([start]);
    var closedSet = new Set();
    start.gScore = 0;
    start.fScore = heuristic(start, goal);
    while (openSet.size > 0) {
      var current = Array.from(openSet).reduce((acc, Map_Node) => {
        if (acc == null || Map_Node.fScore < acc.fScore) {
          return Map_Node;
        } else {
          return acc;
        }
      }, null);
      if (current === goal) {
        return constructPath(goal);
      }
      openSet.delete(current);
      closedSet.add(current);
      for (var neighbor of current.neighbors) {
        if (closedSet.has(neighbor)) {
          continue;
        }
        var tentativeGScore = current.gScore + distance(current, neighbor);
        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        } else if (tentativeGScore >= neighbor.gScore) {
          continue;
        }
        neighbor.previous = current;
        neighbor.gScore = tentativeGScore
        neighbor.fScore = neighbor.gScore + heuristic(neighbor, goal);
      }
    }
    return null;
  }
  
  function constructPath(goal) {
    var path = [goal];
    var current = goal;
    while (current.previous) {
      path.unshift(current.previous);
      current = current.previous;
    }
    return path;
  }
  
//   var start = new Map_Node("Start", 0, 0);
//   var goal = new Map_Node("Goal", 5, 5);
//   var Map_Node1 = new Map_Node("Map_Node 1", 2, 0);
//   var Map_Node2 = new Map_Node("Map_Node 2", 3, 1);
//   var Map_Node3 = new Map_Node("Map_Node 3", 4, 2);
//   var Map_Node4 = new Map_Node("Map_Node 4", 2, 3);
  
//   start.neighbors = [Map_Node1, Map_Node2];
//   Map_Node1.neighbors = [Map_Node3, Map_Node4];
//   Map_Node2.neighbors = [Map_Node3];
//   Map_Node3.neighbors = [goal];
//   Map_Node4.neighbors = [goal];
  
//   var path = aStar(start, goal);
  //console.log(path);
  