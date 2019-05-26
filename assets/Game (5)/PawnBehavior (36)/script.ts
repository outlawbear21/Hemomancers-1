class PawnBehavior extends Sup.Behavior {
  socketMan: SocketIOManager;
  mapMan: MapManager;
  health:number;
  attack:number;
  range: number;
  moves:number;
  owner:string;
  can_atk: boolean;
  statBar: Sup.Actor;
  
  awake() {
    this.socketMan = MessagePasser.socketMan;
    this.mapMan = MessagePasser.mapManager;
    
    this.setupStatBar();
    
    MouseBehavior.gridUnits.push(this.actor);
  }

  update() {
    if(this.owner == this.socketMan.playerId) {
      this.actor.getChild(this.actor.getName() + "bg").setVisible(true);
    }  else {
      this.actor.getChild(this.actor.getName() + "bg").setVisible(false);
    }
  }
    
  move(data) {
    let grid_start = MapManager.coords_to_grid(this.actor.getLocalPosition());
    let grid_end = MapManager.coords_to_grid(new Sup.Math.Vector3(data.pos.x, data.pos.y, 0));
    this.setMove(data)
    this.actor.setLocalPosition(data.pos);
    this.mapMan.move_pawn(grid_start, grid_end);
    Sup.Audio.playSound("Assets/Wood Sound");
  }
  
  damage(data) {
    this.health = data.health
    this.statBar.getChild(this.actor.getName() + "hb").textRenderer.setText(this.health);
    if (this.health <= 0) {
      this.suicide.bind(this)();
    }
  }
  
  suicide() {
    let grid_start = MapManager.coords_to_grid(this.actor.getLocalPosition());
    this.mapMan.destroy_pawn(grid_start);
    Sup.log(`${this.actor.getName()} suiciding`)
    MouseBehavior.gridUnits = MouseBehavior.gridUnits.filter((unit) => {
      return unit.getName() != this.actor.getName()
    });
    this.actor.destroy();
  }
  
  setupStatBar() {
    let sbAct = new Sup.Actor(this.actor.getName() + "sb", null, {layer: 2});
    let hbAct = new Sup.Actor(this.actor.getName() + "hb", null, {layer: 2});
    let mbAct = new Sup.Actor(this.actor.getName() + "mb", null, {layer: 2});
    let abAct = new Sup.Actor(this.actor.getName() + "ab", null, {layer: 2});
    
    sbAct.spriteRenderer = new Sup.SpriteRenderer(sbAct, "Game/Sprites/indecator")
    sbAct.setParent(this.actor);
    sbAct.setLocalPosition(0, -0.45, 1);
    sbAct.setLocalScaleX(0.1);
    sbAct.setLocalScaleY(0.1);
    
    hbAct.setParent(sbAct);
    hbAct.setLocalScaleX(2);
    hbAct.setLocalScaleY(2);
    hbAct.setLocalPosition(-3.5, 0, 1);
    hbAct.textRenderer = new Sup.TextRenderer(hbAct, this.health, "Game/alagard");
    
    mbAct.setParent(sbAct);
    mbAct.setLocalScaleX(2);
    mbAct.setLocalScaleY(2);
    mbAct.setLocalPosition(0, 0, 1);
    mbAct.textRenderer = new Sup.TextRenderer(mbAct, this.health, "Game/alagard");
    
    abAct.setParent(sbAct);
    abAct.setLocalScaleX(2);
    abAct.setLocalScaleY(2);
    abAct.setLocalPosition(3.5, 0, 1);
    abAct.textRenderer = new Sup.TextRenderer(abAct, this.health, "Game/alagard");
    
    let bg = new Sup.Actor(this.actor.getName() + "bg", null, {layer: 2})
    bg.spriteRenderer = new Sup.SpriteRenderer(bg, "Game/Sprites/GreenBackground")
    bg.spriteRenderer.setOpacity(0.6);
    bg.setParent(this.actor);
    bg.setLocalPosition(0, 0, -1);
    bg.setVisible(false);
    
    this.statBar = sbAct;
  }
  
  setMove(data) {
    this.moves = data.moves_left;
    this.statBar.getChild(this.actor.getName() + "mb").textRenderer.setText(this.moves);
  }
  
  setAttack(data) {
    this.attack = data.damage
    this.statBar.getChild(this.actor.getName() + "ab").textRenderer.setText(this.attack);
  }
  
  setHealth(newHealth) {
    this.health = newHealth
    this.statBar.getChild(this.actor.getName() + "hb").textRenderer.setText(newHealth);
  }
  
  getHealth() {
    return this.health;
  }
}
Sup.registerBehavior(PawnBehavior);
