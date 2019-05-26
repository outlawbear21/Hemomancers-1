class BackButtonBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    if (Sup.Input.wasMouseButtonJustPressed(0)) {
      Sup.loadScene("Menu/menu");
  }
}}
Sup.registerBehavior(BackButtonBehavior);

