class StorePieceBehavior extends Sup.Behavior {
  socketMan: SocketIOManager;
  type: String;
  statBar:Sup.Actor;

  awake() {
    this.socketMan = MessagePasser.socketMan;
    this.setupStatBar()
    this.socketMan.on('pawn_opt_ref', (data) => {
      if ('Unit' + data['option_num'] == this.actor.getName()) {
        this.update_unit_info(data)
      } 
    })
  }

  update() {
    
  }
  
  update_unit_info(data) {
    this.type = data['type_name']
    this.actor.spriteRenderer.setSprite("Game/Sprites/" + this.type)
    this.statBar.getChild(this.actor.getName() + "hb").textRenderer.setText(data['health']);
    this.statBar.getChild(this.actor.getName() + "mb").textRenderer.setText(data['moves_left']);
    this.statBar.getChild(this.actor.getName() + "ab").textRenderer.setText(data['attack']);
    this.actor.getChild(this.actor.getName() + "Cost").textRenderer.setText("x" + data['cost']);
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
    hbAct.textRenderer = new Sup.TextRenderer(hbAct, 0, "Game/alagard");
    
    mbAct.setParent(sbAct);
    mbAct.setLocalScaleX(2);
    mbAct.setLocalScaleY(2);
    mbAct.setLocalPosition(0, 0, 1);
    mbAct.textRenderer = new Sup.TextRenderer(mbAct, 0, "Game/alagard");
    
    abAct.setParent(sbAct);
    abAct.setLocalScaleX(2);
    abAct.setLocalScaleY(2);
    abAct.setLocalPosition(3.5, 0, 1);
    abAct.textRenderer = new Sup.TextRenderer(abAct, 0, "Game/alagard");
    
    this.statBar = sbAct;
  }
}
Sup.registerBehavior(StorePieceBehavior);
