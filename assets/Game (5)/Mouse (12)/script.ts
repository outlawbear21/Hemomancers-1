
const SQUARE_WIDTH = 1.265;
const SQUARE_HEIGHT = 1.42;

let heroName: string;

class MouseBehavior extends Sup.Behavior {
  /** The selected character if a character is selected. */
  curChar: Sup.Actor;
  
  //the character we are currently buying
  buyChar: Sup.Actor;

  // Centralized event mechanism, handles all outbound
  socketMan: SocketIOManager;
  mapMan: MapManager
  
  // UI controls
  hittable: Sup.Actor[];
  
  // Ui elements for buyable units
  buyCards: Sup.Actor[];
   
  // Units on grid
  static gridUnits: Sup.Actor[] = [];
  
  // The move/attack overlay
  movDisp: Sup.Actor[];
  
  awake() {
    this.socketMan = MessagePasser.socketMan;
    this.mapMan = MessagePasser.mapManager;
    this.movDisp = [];
    
    this.socketMan.on('Pawn Create', this.pawnCreate.bind(this));
    // this.inEmitter.on('Pawn Move', this.pawnMove);
    this.socketMan.on('Pawn Damage', (data)=>{
      let vicPawn = Sup.getActor("" + data.vic_pawn_id)
      let vicBehavior = vicPawn.getBehavior(PawnBehavior) || vicPawn.getBehavior(HeroBehavior)
      vicBehavior.damage(data)
      
      if (data.atk_pawn_id) {
        let atkPawn = Sup.getActor("" + data.atk_pawn_id)
        let atkBehavior = atkPawn.getBehavior(PawnBehavior) || vicPawn.getBehavior(HeroBehavior)
        atkBehavior.can_atk = false;
      }
    });
    this.socketMan.on("Pawn Move", (data) => {
      let pawn = Sup.getActor("" + data.pawn_id);
      pawn.getBehavior(PawnBehavior).move(data);
    });
    
    this.socketMan.on('hero_create', (data) => {
      data.pos = MapManager.grid_to_coord(data.pos, 0);
      if(data.owner == this.socketMan.playerId) {
        Sup.log("creating hero");
        data.type = "oldmanpiece";
        this.create_hero(data);
      } else {
        data.type = "oldmanpiece2";
        this.pawnCreate(data);
      }
    })

    // init UI ray array
    this.hittable = [Sup.getActor("Unit1"),Sup.getActor("Unit2"),Sup.getActor("Unit3"),Sup.getActor("End Turn Button")];
  }
  
  update() {
     
    // Sup.log(TWEEN.getAll());
    // TWEEN.update();
    
    let instruction = Sup.getActor("instruction")
    let instructionText = instruction.textRenderer;
    instruction.setVisible(true);
    
    if (this.socketMan.playerId != this.socketMan.currPlayer) {
      instructionText.setText("Their Turn");
    } else if (this.curChar) {
      instructionText.setText("Select a blue square to move, or a red square to attack");
    } else if (this.buyChar) {
      instructionText.setText("Click on the grid to place");
    } else {
      instructionText.setText("Select a unit from the shop to buy, or a unit on the grid to move");
    }
    
    if (Sup.Input.wasMouseButtonJustPressed(0)) {
      let pos = Sup.Input.getMousePosition();
      pos.x = (pos.x + 1) / 2 * Sup.Input.getScreenSize().x;
      pos.y = (1 - (pos.y + 1) / 2) * Sup.Input.getScreenSize().y;
      
      // Create ray from camera to mouse pos
      let ray = new Sup.Math.Ray();
      ray.setFromCamera(Sup.getActor("CameraMan").camera, Sup.Input.getMousePosition());
      
      // CLICK ON CHARACTER ----------------------------------------------------------

      // Ray hit a character
      let hits = ray.intersectActors(MouseBehavior.gridUnits);

      for (let hit of hits) {
        if (this.curChar == hit.actor) {
          this.unselChar();
        } else if (this.curChar) {
          let gridSpot = MapManager.coords_to_grid(this.curChar.getLocalPosition());
          let hitGrid = MapManager.coords_to_grid(hit.actor.getLocalPosition());
          let atkRange = this.curChar.getBehavior(PawnBehavior).range;
          if (!this.curChar.getBehavior(PawnBehavior).can_atk) {
            atkRange = 0;
          }
          let possMoves = this.mapMan.get_max_range(gridSpot, atkRange);
          let inRange = possMoves.filter((d) => d.x==hitGrid.x && d.y==hitGrid.y).length;
          if (inRange) {
            this.socketMan.emit("Pawn Damage", {
              atk_pawn_id: this.curChar.getName(),
              vic_pawn_id: hit.actor.getName(),
              damage: this.curChar.getBehavior(PawnBehavior).attack
            });
            
            let enemyBehavior = hit.actor.getBehavior(PawnBehavior) || hit.actor.getBehavior(HeroBehavior);
            let enemyRange = enemyBehavior.range;
            let enemyPossMoves = this.mapMan.get_max_range(hitGrid, enemyRange);
            let inEnemyRange = enemyPossMoves.filter((d) => d.x==gridSpot.x && d.y==gridSpot.y).length > 0;
            
            if (inEnemyRange && enemyBehavior.can_atk) {
              this.socketMan.emit("Pawn Damage", {
                atk_pawn_id: hit.actor.getName(),
                vic_pawn_id: this.curChar.getName(),
                damage: enemyBehavior.attack
              });
            }
            
            this.unselChar();
          }
        } else if(hit.actor.getBehavior(PawnBehavior).owner == this.socketMan.playerId) {
          this.selChar(hit.actor);
        }
      }
      
      // CLICK ON UI ------------------------------------------------------------------
      
      let UIHits = ray.intersectActors(this.hittable);
      
      
      for(let UIhit of UIHits) {
        switch(UIhit.actor.getName()) {
            
          // case "Unit1":
          //   // Sup.getActor("actions").setVisible(false);
          //   // this.hittable = [Sup.getActor("back")];
          //   // this.hittable = this.hittable.concat(this.buyCards);
          //   // Sup.getActor("market").setVisible(true);
          //   // Sup.getActor("back").setVisible(true);
          //   // Sup.getActor("instruction").textRenderer.setText("Buy a spell or item from the shop.");
          //   // Sup.getActor("instruction").setVisible(true);
          // break;
            
            
          case "Unit1":
            
          case "Unit2":
            //just summon unit 2
          case "Unit3":
            //summon unit 
            if (this.buyChar) {
              this.unselBuyChar();
            } else {
              this.unselChar()
              this.selBuyChar(UIhit.actor);
            }
            break;
          case "End Turn Button":
            this.socketMan.emit('next_turn', {});
            //hide the menu and do other general stuff
            break;
            
          default:
            Sup.log("error?");
          break;
        }
      }
      
      // SELECT AND  MOVE CHARACTER ----------------------------------------------------
      
      // check if clicked empty space
      if (hits.length <= 0 && UIHits.length <= 0) {
        
        // if char selected, move char
        if (this.curChar) {
          let plane = new Sup.Math.Plane(new Sup.Math.Vector3(0,0,-1), this.curChar.getZ());

          let rawCoords = this.get_fixed_mouse_coords();
          // make rawCoords an integer multiple of width and height.
          let gridChar = MapManager.coords_to_grid(this.curChar.getLocalPosition());
          let gridCoords = MapManager.coords_to_grid(rawCoords);
          let numMoves = this.curChar.getBehavior(PawnBehavior).moves;
          let possMoves: Sup.Math.Vector2[] = this.mapMan.get_possible_moves(gridChar, numMoves);
          let inBounds = (gridCoords.x >= 0 && gridCoords.x < MAP_WIDTH) 
                         && (gridCoords.y >= 0 && gridCoords.y < MAP_HEIGHT) 
          let inRange = possMoves.filter((a: Sup.Math.Vector2) => {
            return a.x == gridCoords.x && a.y == gridCoords.y;
          }).length > 0;
          
          if (inBounds && inRange) {
            // sends out move order to server
            this.socketMan.emit("Pawn Move", {
              pawn_id: this.curChar.getName(),
              pos: rawCoords,
              dist: MapManager.a_dist_between(gridCoords, gridChar)
            });
            this.unselChar();
          }
        } else {
          if (this.buyChar) {
            let hero = Sup.getActor(heroName)
            let bev = hero.getBehavior(HeroBehavior);
            let pos = MapManager.coords_to_grid(hero.getLocalPosition());
            let dist = 2;
            let moves = MessagePasser.mapManager.get_possible_moves(pos, dist);
            
            let gridCoords = MapManager.coords_to_grid(this.get_fixed_mouse_coords());
            let inRange = moves.filter((a: Sup.Math.Vector2) => {
              return a.x == gridCoords.x && a.y == gridCoords.y;
            }).length > 0;
            
            if (inRange) {
              let type = this.buyChar.getBehavior(StorePieceBehavior).type;
              Sup.log(`Buying ${type}`)
              this.socketMan.emit("Pawn Create" , {
                unit: this.buyChar.getName(),
                pos: this.get_fixed_mouse_coords(),
                type: type
              });
              this.unselBuyChar();
            }
          }
        }
      }
      
    }
        
  }
  
  get_fixed_mouse_coords(): Sup.Math.Vector3 {
    let ray = new Sup.Math.Ray();
    ray.setFromCamera(Sup.getActor("CameraMan").camera, Sup.Input.getMousePosition());
    let charsPos = Sup.getActor("Characters").getPosition();
    let plane = new Sup.Math.Plane(new Sup.Math.Vector3(0,0,-1), charsPos.z);

    let rawCoords = ray.intersectPlane(plane).point;
    rawCoords = rawCoords.subtract(charsPos);
    const x = Math.round(rawCoords.x / SQUARE_WIDTH);
    const y = Math.round(rawCoords.y / SQUARE_HEIGHT);
    rawCoords.x = (x * SQUARE_WIDTH);
    rawCoords.y = (y * SQUARE_HEIGHT);
    rawCoords.z = charsPos.z;
    return rawCoords;
  }
  
  pawnCreate(data:{
    match_id:String, 
    type:String,
    pos:Sup.Math.Vector3, 
    pawn_id: string, 
    health: number, 
    moves_left: number, 
    damage: number, 
    owner:string, 
    attack_range:number,
    can_atk: boolean,
    }) {
    //Sup.log(data);
    Sup.log("create listener entered.");
    let newActor = new Sup.Actor("" + data.pawn_id, null, {layer: 2});
    Sup.log("new actor created.");
    newActor.spriteRenderer = new Sup.SpriteRenderer(newActor, "Game/Sprites/" + data.type);
    Sup.log("sprite renderer created.");
    newActor.addBehavior(PawnBehavior);
    newActor.getBehavior(PawnBehavior).setHealth(data.health);
    newActor.getBehavior(PawnBehavior).setAttack(data);
    newActor.getBehavior(PawnBehavior).setMove(data);
    newActor.getBehavior(PawnBehavior).range = data.attack_range;
    newActor.getBehavior(PawnBehavior).can_atk = data.can_atk;
    newActor.getBehavior(PawnBehavior).owner = data.owner;
    newActor.getBehavior(PawnBehavior).range = data.attack_range;
    newActor.setParent(Sup.getActor("Characters"));
    Sup.log("parent set.");
    Sup.getActor("" + data.pawn_id).setLocalPosition(data.pos);
    Sup.log("position set.");
    MessagePasser.mapManager.place_pawn(MapManager.coords_to_grid(data.pos), newActor);
    Sup.Audio.playSound("Assets/Wood Sound");
    
    if (this.socketMan.playerId == data.owner && Sup.getActor(heroName)) {
      let hero = Sup.getActor(heroName).getBehavior(HeroBehavior);
      // hero.setHealth(hero.getHealth() - 1);
    }
  }
  
  create_hero(data) {
    Sup.log("create listener entered.");
    let newActor = new Sup.Actor("" + data.pawn_id, null, {layer: 2});
    heroName = "" + data.pawn_id;
    Sup.log("new actor created.");
    newActor.spriteRenderer = new Sup.SpriteRenderer(newActor, "Game/Sprites/oldmanpiece");
    newActor.addBehavior(HeroBehavior);
    newActor.getBehavior(HeroBehavior).setHealth(data.health);
    newActor.getBehavior(HeroBehavior).setAttack(data);
    newActor.getBehavior(HeroBehavior).setMove(data);
    newActor.getBehavior(HeroBehavior).range = data.attack_range;
    newActor.getBehavior(HeroBehavior).owner = data.owner;
    newActor.getBehavior(HeroBehavior).range = data.attack_range;
    newActor.getBehavior(HeroBehavior).can_atk = true;
    newActor.setParent(Sup.getActor("Characters"));
    Sup.log("parent set.");
    Sup.getActor("" + data.pawn_id).setLocalPosition(data.pos);
    Sup.log("position set.");
    MessagePasser.mapManager.place_pawn(MapManager.coords_to_grid(data.pos), newActor);
  }
  
//   pawnMove(data) {
//     let actor = Sup.getActor(data.name);
//     Sup.log(data.pos);
//     Sup.getActor(data.name).setLocalPosition(data.pos);
//     // let tween =  new TWEEN.Tween(actor).to(data.pos, 100);
//     // tween.start();
//   }
  
//   pawnDestroy(data) {
//     Sup.getActor(data.name).destroy();
//   }
  
  selChar(char: Sup.Actor){
    this.curChar = char;
    this.curChar.spriteRenderer.setAnimation("selected", true);
    let pos = MapManager.coords_to_grid(this.curChar.getLocalPosition());
    let bev = this.curChar.getBehavior(PawnBehavior) || this.curChar.getBehavior(HeroBehavior);
    let dist = bev.moves;
    let range = bev.range;
    if (!bev.can_atk) {
      range = 0;
    }
    let moves = MessagePasser.mapManager.get_possible_moves(pos, dist);
    let atks = MessagePasser.mapManager.get_max_range(pos, range);
    let overlayCount = 0;
    
    for (let move of moves) {
      let sqr = new Sup.Actor("over" + overlayCount, null, {layer:2});
      this.movDisp.push(sqr);
      sqr.setParent(Sup.getActor("Characters"));
      sqr.setLocalPosition(MapManager.grid_to_coord(move, 2));
      sqr.spriteRenderer = new Sup.SpriteRenderer(sqr, "Game/Sprites/MovSqr");
    }
    
    for (let atk of atks) {
      let sqr = new Sup.Actor("over" + overlayCount, null, {layer:2});
      this.movDisp.push(sqr);
      sqr.setParent(Sup.getActor("Characters"));
      sqr.setLocalPosition(MapManager.grid_to_coord(atk, 2));
      sqr.spriteRenderer = new Sup.SpriteRenderer(sqr, "Game/Sprites/AtkSqr");
    }
  }
  
  unselChar(){
    if (this.curChar) {
      Sup.log(this.movDisp);
      this.curChar.spriteRenderer.setAnimation("default", true);
      this.curChar = null;

      for (let sqr of this.movDisp) {
        sqr.destroy();  
      }
      this.movDisp = [];
    }
  }
  
  selBuyChar(char: Sup.Actor) {
    this.buyChar = char;
    this.buyChar.spriteRenderer.setAnimation("selected");
    Sup.log(`Selected ${this.buyChar.getName()}`);
    
    let hero = Sup.getActor(heroName)
    let bev = hero.getBehavior(HeroBehavior);
    let pos = MapManager.coords_to_grid(hero.getLocalPosition());
    let dist = 2;
    let moves = MessagePasser.mapManager.get_possible_moves(pos, dist);
    let overlayCount = 0;
    
    for (let move of moves) {
      let sqr = new Sup.Actor("over" + overlayCount, null, {layer:2});
      this.movDisp.push(sqr);
      sqr.setParent(Sup.getActor("Characters"));
      sqr.setLocalPosition(MapManager.grid_to_coord(move, 2));
      sqr.spriteRenderer = new Sup.SpriteRenderer(sqr, "Game/Sprites/MovSqr");
    }
  }
  
  unselBuyChar() {
    if (this.buyChar) {
      this.buyChar.spriteRenderer.setAnimation("default");
      this.buyChar = null;
    }
    
    for (let sqr of this.movDisp) {
      sqr.destroy();  
    }
    this.movDisp = [];
  }
  
}
Sup.registerBehavior(MouseBehavior);
