import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Inject } from '@angular/core';

  
export class Map_Node {
    constructor(
        public name: L.LatLng, 
        @Inject('g') public g: number, 
        @Inject('f') public f: number, 
        @Inject('parent') public parent: Map_Node | any = null
    ) {}
}

class AStar {
    openList: Map_Node[];
    closedList: Map_Node[];
    path: Map_Node[];
    constructor() {
        this.openList = [];
        this.closedList = [];
        this.path = [];
    }
    
    public isObstacle(nodeName: L.LatLng) : boolean {
      // Your implementation here
      // for example you can check if the nodeName is in a certain area or if it has certain properties.
      return false;
  }

    heuristic(pos0: L.LatLng, pos1: L.LatLng): number {
        // Manhattan distance
        let d1 = Math.abs(pos1.lat - pos0.lat);
        let d2 = Math.abs(pos1.lng - pos0.lng);
        return d1 + d2;
    }

    distance(pos0: L.LatLng, pos1: L.LatLng): number {
        // Manhattan distance
        let d1 = Math.abs(pos1.lat - pos0.lat);
        let d2 = Math.abs(pos1.lng - pos0.lng);
        return d1 + d2;
    }

    findPath(start: Map_Node, goal: Map_Node): Map_Node[] {
        this.openList.push(start);
        while (this.openList.length > 0) {
            // Get the node with the lowest f value
            let lowestIndex = 0;
            for (let i = 0; i < this.openList.length; i++) {
                if (this.openList[i].f < this.openList[lowestIndex].f) {
                    lowestIndex = i;
                }
            }
            let currentNode = this.openList[lowestIndex];
            // End case -- result has been found, return the traced path
            if (currentNode.name.lat === goal.name.lat && currentNode.name.lng === goal.name.lng) {
                let current = currentNode;
                this.path.push(current);
                while (current.name.lat !== start.name.lat && current.name.lng !== start.name.lng) {
                    current = current.parent;
                    this.path.push(current);
                  }
                  this.path.reverse();
                  return this.path;
                  }
                  // Normal case -- move currentNode from open to closed, process each of its neighbors
                  this.openList.splice(lowestIndex, 1);
                  this.closedList.push(currentNode);
                  let neighbors: Map_Node[] = [];
                  // Add all valid neighbors to the openList
                  for (let i = 0; i < neighbors.length; i++) {
                  let neighbor = neighbors[i];
                  if (!this.closedList.includes(neighbor) && !this.isObstacle(neighbor.name)) {
                  neighbor.g = currentNode.g + this.distance(currentNode.name, neighbor.name);
                  neighbor.f = neighbor.g + this.heuristic(neighbor.name, goal.name);
                  neighbor.parent = currentNode;
                  if (!this.openList.includes(neighbor)) {
                  this.openList.push(neighbor);
                  }
                  
                  }
                  }
                  }
                  // No result was found -- empty array signifies failure to find path
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
export class MapManagerComponent implements OnInit {
  map!: L.Map;
  astar: AStar;
  @ViewChild('map', {static: false}) mapContainer!: ElementRef;

  constructor() {
    this.astar = new AStar();
  }

  ngOnInit() {
    this.map = L.map("map", {
      center: [51.505, -0.09],
      zoom: 13
    });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
    }).addTo(this.map);
    this.map.on('click', this.handleMapClick.bind(this));
  }

  handleMapClick(e: L.LeafletMouseEvent) {
    let start = new Map_Node(new L.LatLng(51.505, -0.09), 0, 0);
    let goal = new Map_Node(e.latlng, 0, 0);
    let path = this.astar.findPath(start, goal);
    console.log(path);

    // Add markers for start and goal
    let startMarker = L.marker(start.name).addTo(this.map);
    let goalMarker = L.marker(goal.name).addTo(this.map);

    // Draw the path on the map
    let pathLine = L.polyline(path.map(node => node.name), {color: 'red'}).addTo(this.map);
  }
}
