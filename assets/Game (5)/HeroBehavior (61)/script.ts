
class HeroBehavior extends PawnBehavior {
  awake() {
    super.awake();
    
    this.socketMan.on('HealthUpdate', (data) => {
      if (data.player_id == this.socketMan.playerId) {
        this.health = data.health;
      }
    });
    Sup.getActor("Life Total").setVisible(true);
  }

  update() {
    
    // if(this.health > 10){
    //   this.health = 10;
    // }
    
    Sup.getActor("Life Total").textRenderer.setText("x" + this.health);
    
    // if (this.health != maxHealth) {
    //   var difference = maxHealth - this.health;
    //   for(let i = 1; i <= this.health; i++){
    //     Sup.getActor("Chunk" + (i)).setVisible(true); //For 8 chunks, name them "Chunk1, Chunk2, ..... Chunk8".
    //   }
    //   for(let j = maxHealth; j > this.health; j--){
    //     Sup.getActor("Chunk" + (j)).setVisible(false); //For 8 chunks, name them "Chunk1, Chunk2, ..... Chunk8".
    //   }
    // }
    
  }
  

  
  suicide() {
    this.socketMan.disconnect();
    Sup.loadScene("Menu/menu");
  }
}
Sup.registerBehavior(HeroBehavior);
