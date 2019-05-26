class MessagePasser extends Sup.Behavior {
  /** Inbound Socket events - update state */
  static socketMan: SocketIOManager
  static mapManager: MapManager
  
  awake() {
    MessagePasser.socketMan = new SocketIOManager();
    MessagePasser.mapManager = new MapManager();
  }
}
Sup.registerBehavior(MessagePasser)


class SocketIOManager {
  socket: SocketIOClient.Socket;
  matchId: number;
  playerId: String;
  inEmitter: EventEmitter;
  currPlayer; String;
  
  constructor () {

    this.inEmitter = new EventEmitter();
    this.socket = io("192.168.0.167:8080")
    // this.socket = io("http://34.83.221.102/");
    this.matchId = -1;
    
    this.socket.on('message', (data) => {
      Sup.log(data);
    });
    
    this.socket.on('onConnect', (data) => {
      this.playerId = data.player_id;
      Sup.log("connected: " + this.playerId);
    });
    
    this.socket.on('request_match', (data) => {
      Sup.log("Match id:" + data);
      this.matchId = data
    });
    
     this.on('pawn_update', (data) =>{
       Sup.log(data);
       let currPawn = Sup.getActor("" + data.pawn_id).getBehavior(PawnBehavior);
       currPawn.damage(data)
       currPawn.setAttack(data)
       currPawn.range = data.attack_range;
       currPawn.setMove(data);
       currPawn.can_atk = true;
     })
    
    this.socket.on('game_end', (data) => {
      Sup.log(data);
      this.socket.disconnect();
      Sup.loadScene('Menu/menu');
    });
    
    Sup.getActor("BehaviorSlave").getBehaviors[0];
    
    Sup.Input.on("exit", () => {
      this.socket.disconnect();
    })
    
    this.on('turn_change', (data) => {
      this.currPlayer = data;
    })
  }

  emit(topic: string, data:Object) {
    if (this.matchId < 0) {
      return;
    }
    if(this.currPlayer != this.playerId){
      return;
    }
    let fixedData = {
      match_id: this.matchId,
      data: data
    };
    Sup.log(`Sent to ${topic}`)
    Sup.log(data)
    Sup.log("---------------------------")
    
    this.socket.emit(topic, fixedData)
  }
  
  on(topic: string, func: (any) => void) {
    this.socket.on(topic, (data) => {
      Sup.log(`Received from ${topic}`)
      Sup.log(data)
      Sup.log("---------------------------")
      func(data);
    });
  }
  
  disconnect() {
    this.socket.disconnect();
  }
}
