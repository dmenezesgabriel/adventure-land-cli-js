import {
  makeBrowserContext,
  selectCharacters,
  startCharacter,
  login,
} from "./src/emulator.js";
import dotenv from "dotenv";
import User from "./src/user.js";
import logger from "./src/logger.js";
import Game from "./src/game.js";

dotenv.config();

const baseUrl = "https://adventure.land/";

const HEADLESS = process.env.HEADLESS;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const TARGET_SERVER_IDENTIFICATOR = process.env.TARGET_SERVER_IDENTIFICATOR;
const CHARACTERS = process.env.CHARACTERS.split(" ");
const MAIN_CODE_PATH = process.env.MAIN_CODE_PATH;

//  Run
async function main() {
  logger.info(`Starting`);
  // Instantiate a user to authenticate
  let user = new User(EMAIL, PASSWORD);

  logger.info("Getting session");
  await user.getSession();
  await user.getCharacters();

  // Post CODE to slot
  await user.postCode(MAIN_CODE_PATH, 1, "main_code");

  // logger.info("Getting servers");
  // let game = new Game(user.sessionCookie, user.userId);
  // await game.getServers();

  // // Chose server to connect
  // const targetServer = game.servers[TARGET_SERVER_IDENTIFICATOR];

  // // Create browser context
  // const context = await makeBrowserContext(HEADLESS);
  // await login(context, baseUrl, EMAIL, PASSWORD);

  // // Select characters to deploy
  // const characters = await selectCharacters(user, CHARACTERS);

  // // Deploy
  // logger.info(`Deploy each character`);
  // for (const char of characters) {
  //   await startCharacter(context, baseUrl, char, targetServer);
  // }
}

await main();
