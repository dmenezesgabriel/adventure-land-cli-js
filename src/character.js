import logger from "./logger.js";
import Connector from "./socketConnector.js";

class Character extends Connector {
  constructor(serverData, characterData, userId, sessionCookie) {
    super(serverData);
    this.characterId = characterData.id;
    this.userId = userId;
    this.sessionCookie = sessionCookie;
  }
  async connect() {
    logger.info(`Connecting to ${this.serverRegion}:${this.serverName}...`);
    logger.info(`Connecting to ${this.serverAddr}:${this.serverPort}...`);
    this.socket = socketio(`wss://${this.serverAddr}:${this.serverPort}`, {
      secure: true,
      transports: ["websocket"],
    });
    let lasttime = new Date().getTime();

    this.socket.on("welcome", (data) => {
      logger.info("Socket loading");
      // Send a response that we're ready to go
      this.socket.emit("loaded", {
        success: 1,
        width: 1366,
        height: 768,
        scale: 10,
      });
    });

    // When we're loaded, authenticate
    this.socket.on("welcome", (data) => {
      logger.info("Socket Authentication");

      this.socket.emit("auth", {
        auth: this.sessionCookie,
        character: this.characterId,
        height: 768,
        code_slot: this.characterId,
        no_graphics: "True",
        no_html: "1",
        passphrase: "",
        scale: 2,
        user: this.userId,
        width: 1366,
      });
    });
  }
}
