class MenuBehaviour extends Sup.Behavior {
  awake() {
    
  }
  
  update() {
    if(Sup.Input.wasMouseButtonJustPressed(0)){
      let ray = new Sup.Math.Ray();
      
      ray.setFromCamera(this.actor.camera, Sup.Input.getMousePosition());
      let hits = ray.intersectActors([Sup.getActor("play button"),Sup.getActor("how to play")]);
      Sup.log(ray.getOrigin());
      Sup.log(ray.getDirection());
      for(let hit of hits){
        if(hit.actor.getName() == "play button") {
          Sup.loadScene("Game/Main");
        }
        if(hit.actor.getName() == "how to play"){
          Sup.loadScene("Tutorial/tutorial");
        }
      }
    }
  }
}
Sup.registerBehavior(MenuBehaviour);
