const maxHealth = 6;

class PlayerBehavior extends Sup.Behavior {
  socketMan: SocketIOManager;
  playerHealth: number;
  awake() {
    this.socketMan = MessagePasser.socketMan;
    this.socketMan.on('HealthUpdate', (data) => {
      if (data.player_id == this.socketMan.playerId) {
        this.setHealth(data.health);
      }
    });
    this.playerHealth = 6;
  }

  update() {
    if(this.playerHealth < 1){
      this.socketMan.disconnect();
      Sup.loadScene("Menu/menu");
    }
    if(this.playerHealth > 6){
      this.playerHealth = 6;
    }
   if(this.playerHealth != maxHealth){
   var difference = maxHealth - this.playerHealth;
    for(let i = 1; i <= this.playerHealth; i++){
      Sup.getActor("Chunk" + (i)).setVisible(true); //For 8 chunks, name them "Chunk1, Chunk2, ..... Chunk8".
    }
    for(let j = maxHealth; j > this.playerHealth; j--){
      Sup.getActor("Chunk" + (j)).setVisible(false); //For 8 chunks, name them "Chunk1, Chunk2, ..... Chunk8".
    }
  }
}
  setHealth(x: number){
    this.playerHealth = x;
  }
  getHealth(){
    return this.playerHealth;
  }
  
}
Sup.registerBehavior(PlayerBehavior);
