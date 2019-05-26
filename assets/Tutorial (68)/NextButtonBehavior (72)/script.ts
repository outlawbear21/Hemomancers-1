class NextButtonBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    if (Sup.Input.wasMouseButtonJustPressed(0)) {
      Sup.loadScene("Tutorial/tutorial2");
  }
}}
Sup.registerBehavior(NextButtonBehavior);
