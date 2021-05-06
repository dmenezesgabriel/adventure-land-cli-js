import puppeteer from "puppeteer";
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

//  Sleep for x seconds
async function sleep(seconds) {
  logger.info(`Sleeping for ${seconds} seconds`);
  const ms = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//  Log page logs
async function logPageConsole(page) {
  page.on("console", (msg) => logger.info(`Game log: ${msg.text()}`));
}

// Open browser
async function makeBrowserContext() {
  logger.info("Creating browser context");

  //  Set browser
  const browser = await puppeteer.launch({
    // Set to run without a graphic interface
    headless: HEADLESS,
    args: [
      // Required for Docker version of Puppeteer
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      "--disable-dev-shm-usage",
    ],
  });

  // Create Incognito Browser context
  return await browser.createIncognitoBrowserContext();
}

async function selectCharacters(user) {
  let characters = [];
  for (let character in user.characters) {
    let targetCharacterId = user.characters[character]["id"];
    let targetCharacterName = user.characters[character]["name"];

    //  Check if character should be deployed
    if (CHARACTERS.includes(targetCharacterName)) {
      logger.info(`Deploy`);
      characters.push({
        name: `${targetCharacterName}`,
        // NOTE: the loginJS can be extracted from the DOM of the browser.
        loginJS: `if(!observe_character('${targetCharacterName}')) log_in(user_id,${targetCharacterId},user_auth)`,
      });
    }
  }
  return characters;
}

async function startCharacter(context, character, targetServer) {
  logger.info(`Starting - ${character.name}`);
  const page = await context.newPage();
  await page.goto(baseUrl);
  await sleep(5);
  // Connect to target server
  await page.evaluate(
    `server_addr='${targetServer.addr}'; server_port='${targetServer.port}'; init_socket();`
  );
  await sleep(5);
  // Load CODE slot
  await page.evaluate(`load_code("1",1);`);
  await sleep(5);
  await page.evaluate(character.loginJS); // login character
  await sleep(5);
  await logPageConsole(page);
  logger.info(`Escape`);
  await page.keyboard.press("Escape"); // close menu
  await sleep(1);
  logger.info(`Backslash - Running CODE`);
  await page.keyboard.press("Backslash"); // run code
  await sleep(3);
}

// Login at browser client
async function login(context, email = EMAIL, password = PASSWORD) {
  const page = await context.newPage();
  logger.info(`Go to ${baseUrl}`);
  await page.goto(baseUrl);
  await sleep(5);
  await page.evaluate(
    "$('#loginbuttons').hide(); $('#loginlogin').show(); on_resize()"
  );
  await sleep(2);
  logger.info(`Fill credentials`);
  await page.type("#email2", email);
  await page.type("#password2", password);
  logger.info(`Click login`);
  await page.evaluate(
    "api_call_l('signup_or_login',{email:$('#email2').val(),password:$('#password2').val(),only_login:true},{disable:$(this)})"
  );
  //  Close the page
  await sleep(6);
  page.close();
}

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

  logger.info("Getting servers");
  let game = new Game(user.sessionCookie, user.userId);
  await game.getServers();

  // Chose server to connect
  const targetServer = game.servers[TARGET_SERVER_IDENTIFICATOR];

  // Create browser context
  const context = await makeBrowserContext();
  await login(context);

  // Select characters to deploy
  const characters = await selectCharacters(user);

  // Deploy
  logger.info(`Deploy each character`);
  for (const char of characters) {
    await startCharacter(context, char, targetServer);
  }
}

await main();
