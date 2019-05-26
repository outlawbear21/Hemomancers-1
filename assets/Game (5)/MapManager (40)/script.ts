const MAP_WIDTH = 14
const MAP_HEIGHT = 5

const NULL_ACTOR = new Sup.Actor("null")

function vectorEquals(a: Sup.Math.Vector3, b: Sup.Math.Vector3): boolean {
  return a.x == b.x && a.y == b.y;
}

class MapManager {
  mapMatrix: Sup.Actor[][];
  
  constructor () {
    this.mapMatrix = [];
    for (let i = 0; i < MAP_HEIGHT; i++) {
      this.mapMatrix.push(new Array(MAP_WIDTH));
      for (let j = 0; j < MAP_WIDTH; j++) {
        this.mapMatrix[i][j] = NULL_ACTOR;
      }
    }
  }
  
  place_pawn(pos: Sup.Math.Vector2, actor: Sup.Actor) {
    Sup.log(pos);
    this.mapMatrix[pos.y][pos.x] = actor;
  }
  
  get_pawn(pos: Sup.Math.Vector2) {
    return this.mapMatrix[pos.y][pos.x]
  }
  
  move_pawn(currPos: Sup.Math.Vector2, newPos: Sup.Math.Vector2) {
    let p1 = this.get_pawn(currPos)
    this.place_pawn(currPos, NULL_ACTOR)
    this.place_pawn(newPos, p1)
  }
  
  destroy_pawn(pos: Sup.Math.Vector2) {
    this.place_pawn(pos, NULL_ACTOR)
  }
  
  get_possible_moves(start: Sup.Math.Vector2, dist: number) {
    if (dist <= 0 ) {
      return [];
    }
    let spots: {spot:Sup.Math.Vector2, distLeft:number}[] = [];
    let visitedBlocks: Sup.Math.Vector2[] = []

    for(let v of this.get_adjecent_points(start)) {
      if (this.mapMatrix[v.y][v.x] == NULL_ACTOR) {
        visitedBlocks.push(v)
        spots.push({spot: v, distLeft: dist - 1})
      }
    }
    
    while (spots.length > 0) {
      let spot = spots.shift();
      for(let v of this.get_adjecent_points(spot.spot)) {
        let vectorsEqual = d => d.x == v.x && d.y==v.y;
        if (spot.distLeft > 0 
            && this.mapMatrix[v.y][v.x] == NULL_ACTOR
            && visitedBlocks.filter(vectorsEqual).length <= 0) {
          visitedBlocks.push(v)
          spots.push({spot: v, distLeft: spot.distLeft - 1})
        }
      } 
    }
    
    return visitedBlocks
  }
  
  get_max_range(start: Sup.Math.Vector2, dist: number) {
    if (dist <= 0 ) {
      return [];
    }
    
    let spots: {spot:Sup.Math.Vector2, distLeft:number}[] = [];
    let visitedBlocks: Sup.Math.Vector2[] = []

    for(let v of this.get_adjecent_points(start)) {
      if (this.mapMatrix[v.y][v.x] != NULL_ACTOR
          && this.mapMatrix[v.y][v.x] != this.mapMatrix[start.y][start.x]) {
        visitedBlocks.push(v)
      }
      spots.push({spot: v, distLeft: dist - 1})
    }
    
    while (spots.length > 0) {
      let spot = spots.shift();
      for(let v of this.get_adjecent_points(spot.spot)) {
        let vectorsEqual = d => d.x == v.x && d.y==v.y;
        let equalStart = d => d.x == start.x && d.y==start.y;
        if (spot.distLeft > 0 
            && this.mapMatrix[v.y][v.x]
            && visitedBlocks.filter(d => vectorsEqual(d)).length <= 0) {
          if (this.mapMatrix[v.y][v.x] != NULL_ACTOR
              && this.mapMatrix[v.y][v.x] != this.mapMatrix[start.y][start.x]) {
            visitedBlocks.push(v)
          }
          spots.push({spot: v, distLeft: spot.distLeft - 1})
        }
      } 
    }
    
    return visitedBlocks
  }
  
  get_precise_range(start: Sup.Math.Vector2, dist: number) {
    if (dist <= 0 ) {
      return [];
    }
    
    let visitedBlocks: Sup.Math.Vector2[] = []
    for (let dy = -dist; dy <= dist; dy++) {
      let y = start.y + dy;
      if (this.mapMatrix[y]) {
        let dx = dist - Math.abs(dy);
        let x = start.x + dx;
        if (this.mapMatrix[y][x]) {
          visitedBlocks.push(new Sup.Math.Vector2(x, y));
        }
        let ndx = -dx;
        x = start.x + ndx;
        if (ndx != dx && this.mapMatrix[y][x]) {
          visitedBlocks.push(new Sup.Math.Vector2(x, y));
        }
      }
    }
    
    return visitedBlocks
  }
  
  
//   find_path (start: Sup.Math.Vector2, final: Sup.Math.Vector2) {
//     let priorityQueue: {path:Sup.Math.Vector2[], weight:number}[] = [];
//     let visitedBlocks: Sup.Math.Vector2[] = []
    
//     for(let v of this.get_adjecent_points(start)) {
//       visitedBlocks.push(v)
//       priorityQueue.push({path: [v], weight: this.a_dist_between(v, final)})
//     }
//     while (priorityQueue.length != 0) {
//       priorityQueue.sort((p1, p2) => {return p2.weight - p1.weight})
//       priorityQueue.forEach((p)=>{Sup.log("Path: " + p.path + " Weight: " + p.weight)})
//       Sup.log('---------------------------------------------')
//       //Explore first path
//       let first =  priorityQueue.pop()
//       for(let v of this.get_adjecent_points(first.path[first.path.length - 1])) {
//         if (visitedBlocks.filter((a)=>{return ((a.x == v.x) && (a.y == v.y))}).length == 0) {
//           visitedBlocks.push(v)
//           let newWeight = this.a_dist_between(v, final);
//           if (newWeight == 0) {
//             Sup.log(first.path.concat(v))
//             return first.path.concat(v)
//           }
//           priorityQueue.push({path: first.path.concat(v), weight: (newWeight + first.weight)})
//         }
//       }
//       /*let adjecent_points = this.get_adjecent_points(start)
//       adjecent_points = adjecent_points.sort((v1, v2) => {return this.a_dist_between(v1, final) - this.a_dist_between(v2, final)})
//       Sup.log(adjecent_points[0])
//       ret.push(adjecent_points[0])
//       start = adjecent_points[0]
//       if (a > 5) break
//       a++*/
//     }
//     return null;
//   }
  
  static a_dist_between (vec1: Sup.Math.Vector2, vec2: Sup.Math.Vector2):number {
    return ((Math.abs(vec2.y - vec1.y) + Math.abs(vec2.x - vec1.x)))
  }
  
  get_adjecent_points (vec: Sup.Math.Vector2):Sup.Math.Vector2[] {
    let pos:Sup.Math.Vector2[] = [new Sup.Math.Vector2(vec.x - 1, vec.y),
                                  new Sup.Math.Vector2(vec.x + 1, vec.y),
                                  new Sup.Math.Vector2(vec.x, vec.y - 1),
                                  new Sup.Math.Vector2(vec.x, vec.y + 1)]
    let ret:Sup.Math.Vector2[] = []
    
    for(let v of pos) {
      if (this.mapMatrix[v.y])
        ret.push(v)
    }
    
    return ret
  }
  
  static coords_to_grid(coord: Sup.Math.Vector3): Sup.Math.Vector2 {
    let {x, y} = coord;
    x /= SQUARE_WIDTH;
    y /= SQUARE_HEIGHT;
    x = Math.round(x);
    y = -Math.round(y);
    return new Sup.Math.Vector2(x,y);
  }
  
  static grid_to_coord(grid: Sup.Math.Vector2, z:number): Sup.Math.Vector3 {
    let {x, y} = grid;
    x *= SQUARE_WIDTH;
    y *= SQUARE_HEIGHT;
    y = -y;
    return new Sup.Math.Vector3(x,y,z);
  }
}
