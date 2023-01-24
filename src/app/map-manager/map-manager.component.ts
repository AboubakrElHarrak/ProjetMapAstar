import { AfterViewInit, Component, ElementRef, OnInit, Optional, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Inject } from '@angular/core';

  
export class Map_Node {
    public name: L.LatLng;
    public g: number;
    public f: number;
    public parent: Map_Node | null;
    public neighbors: Map_Node[]; // new property

    constructor(name: L.LatLng, g: number, f: number, parent: Map_Node | null = null) {
        this.name = name;
        this.g = g;
        this.f = f;
        this.parent = parent;
        this.neighbors = []; // initialize as empty array
    }
}

export class AStar {
  private openList: Map_Node[] = [];
  private closedList: Map_Node[] = [];
  private heuristic: (a: Map_Node, b: Map_Node) => number;

  constructor(heuristic: (a: Map_Node, b: Map_Node) => number) {
    this.heuristic = heuristic;
  }

  findPath(start: Map_Node, goal: Map_Node) {
    this.openList = [];
    this.closedList = [];

    start.g = 0;
    start.f = this.heuristic(start, goal);
    console.log(start.f);

    this.openList.push(start);

    console.log(this.openList)
    console.log(this.openList.length > 0);

    while (this.openList.length > 0) {
      // Get the node with the lowest f value
      let currentNode = this.openList.sort((a, b) => a.f - b.f)[0];

      console.log(currentNode);

      // Check if we've reached the goal
      if (currentNode === goal) {
        let path = [goal];
        let parent = goal.parent;
        while (parent) {
          path.unshift(parent);
          parent = parent.parent;
        }
        return path;
      }

      // Move the current node to the closed list
      this.openList.splice(this.openList.indexOf(currentNode), 1);
      this.closedList.push(currentNode);

      // Get the neighbors
      let neighbors = currentNode.neighbors;
      for (let neighbor of neighbors) {
        // Check if the neighbor has been visited before
        if (this.closedList.indexOf(neighbor) !== -1) {
          continue;
        }

        let gScore = currentNode.g + this.heuristic(currentNode, neighbor);

        // Check if the neighbor is not in the open list or if the new g score is lower than the previous one
        if (this.openList.indexOf(neighbor) === -1 || gScore < neighbor.g) {
          neighbor.g = gScore;
          neighbor.f = neighbor.g + this.heuristic(neighbor, goal);
          neighbor.parent = currentNode;

          if (this.openList.indexOf(neighbor) === -1) {
            this.openList.push(neighbor);
          }
        }
      }
    }

    // If no path is found, return an empty array
    return [];
  }
}
  


@Component({
  selector: 'app-map-manager',
  templateUrl: './map-manager.component.html',
  styleUrls: [
    './map-manager.component.css',
    '../../../node_modules/leaflet/dist/leaflet.css'
  ],
})
export class MapManagerComponent implements AfterViewInit {
  private map!: L.Map;
  private astar: AStar;

  constructor(@Optional() private parent: Map_Node) {
    let heuristic = (a: Map_Node, b: Map_Node) => L.latLng(a.name).distanceTo(L.latLng(b.name));
    this.astar = new AStar(heuristic);
  }

  ngAfterViewInit() {
    this.map = L.map("map", {
      center: [51.505, -0.09],
      zoom: 13
    });

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 18
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      let start = new Map_Node(event.latlng, 0, 0);
      let goal = new Map_Node(new L.LatLng(51.5, -0.1), 0, 0);
      let path = this.astar.findPath(start, goal);
      console.log(path);

      // Add markers for start and goal
      let startMarker = L.marker(start.name).addTo(this.map);
      let goalMarker = L.marker(goal.name).addTo(this.map);

      // Draw the path on the map
      let pathLine = L.polyline(path.map(node => node.name), { color: 'red' }).addTo(this.map);
    });
  }
}