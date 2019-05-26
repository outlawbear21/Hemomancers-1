class UIscriptBehavior extends Sup.Behavior {
  
  hittable: Sup.Actor[];
  mainActions: Sup.Actor[];
  
  awake() {
    this.hittable = [Sup.getActor("buy"),Sup.getActor("recruit"),Sup.getActor("spell")];
    this.mainActions = [Sup.getActor("buy"),Sup.getActor("recruit"),Sup.getActor("spell")];
  }

  update() {
    
    //Handle clicking on action buttons from in game menu.
    if (Sup.Input.wasMouseButtonJustPressed(0)) {
      let pos = Sup.Input.getMousePosition();
      pos.x = (pos.x + 1) / 2 * Sup.Input.getScreenSize().x;
      pos.y = (1 - (pos.y + 1) / 2) * Sup.Input.getScreenSize().y;
      
      let ray = new Sup.Math.Ray();
      ray.setFromCamera(this.actor.camera, Sup.Input.getMousePosition());

      let UIHits = ray.intersectActors(this.hittable);
      
      for(let UIhit of UIHits) {
        switch(UIhit.actor.getName()) {
            
          case "buy":
            Sup.getActor("actions").setVisible(false);
            this.hittable = [Sup.getActor("back")];
            Sup.getActor("market").setVisible(true);
            Sup.getActor("back").setVisible(true);
            Sup.getActor("instruction").textRenderer.setText("Buy a spell or item from the shop.");
            Sup.getActor("instruction").setVisible(true);
          break;
            
          case "recruit":
            Sup.getActor("actions").setVisible(false);
            this.hittable = [Sup.getActor("back")];
            Sup.getActor("market").setVisible(true);
            Sup.getActor("back").setVisible(true);
            Sup.getActor("instruction").textRenderer.setText("Make a contract with a demon.");
            Sup.getActor("instruction").setVisible(true);
          break;
            
          case "spell":
            Sup.getActor("actions").setVisible(false);
            this.hittable = [Sup.getActor("back")];
            Sup.getActor("market").setVisible(true);
            Sup.getActor("back").setVisible(true);
            Sup.getActor("instruction").textRenderer.setText("Cast a spell bought from the shop.");
            Sup.getActor("instruction").setVisible(true);
          break;
            
          case "back":
            if (Sup.getActor("market").getVisible) {
              Sup.getActor("market").setVisible(false);
            }
            Sup.getActor("back").setVisible(false);
            Sup.getActor("instruction").setVisible(false);
            this.hittable = this.mainActions;
            Sup.getActor("actions").setVisible(true);
          break;
            
          default:
            Sup.log("error?");
          break;
        }
      }
    }
  }
}
Sup.registerBehavior(UIscriptBehavior);
