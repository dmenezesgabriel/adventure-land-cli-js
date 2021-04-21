import puppeteer from "puppeteer";
import dotenv from "dotenv";
import User from "./src/user.js";
import logger from "./src/logger.js";

dotenv.config();

const baseUrl = "https://adventure.land/";

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const CHARACTERS = process.env.CHARACTERS.split(" ");

let user = new User(EMAIL, PASSWORD);
logger.info("Getting session");
await user.getSession();
await user.getCharacters();

// Deploy character
async function runCharacter(targetCharacterId, targetCharacterName) {
  logger.info(`Starting ${targetCharacterName}`);
  //  Set browser
  const browser = await puppeteer.launch({
    headless: true,
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
  const context = await browser.createIncognitoBrowserContext();

  //
  // Login
  //
  logger.info(`${targetCharacterName} - Go to`);
  const page = await context.newPage();
  await page.goto(baseUrl);
  logger.info("Sleeping...");
  await sleep(5);
  logger.info(`${targetCharacterName} - Click login`);
  await page.evaluate(
    "$('#loginbuttons').hide(); $('#loginlogin').show(); on_resize()"
  );
  logger.info("Sleeping...");
  await sleep(2);
  await page.type("#email2", EMAIL);
  await page.type("#password2", PASSWORD);
  await page.evaluate(
    "api_call_l('signup_or_login',{email:$('#email2').val(),password:$('#password2').val(),only_login:true},{disable:$(this)})"
  );
  logger.info("Sleeping...");
  await sleep(2);

  (async () => {
    logger.info("Sleeping...");
    await sleep(5);
    page.close();
  })();

  //
  // Run
  //
  // NOTE: the loginJS can be extracted from the DOM of the browser.
  let characters = [
    {
      name: `${targetCharacterName}`,
      loginJS: `if(!observe_character('${targetCharacterName}')) log_in(user_id,${targetCharacterId},user_auth)`,
    },
  ];

  logger.info(`${targetCharacterName} - Login`);
  for (const char of characters) {
    const page = await context.newPage();
    await page.goto(baseUrl);
    logger.info("Sleeping...");
    await sleep(5);
    await page.evaluate(char.loginJS); // select character
    logger.info("Sleeping...");
    await sleep(5);
    logger.info(`${targetCharacterName} - Escape`);
    await page.keyboard.press("Escape"); // close menu
    logger.info("Sleeping...");
    await sleep(1);
    logger.info(`${targetCharacterName} - Backslash - Running CODE`);
    await page.keyboard.press("Backslash"); // run code
    logger.info("Sleeping...");
    await sleep(3600);
  }
}

function sleep(seconds) {
  const ms = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  logger.info(`Deploy characters: ${CHARACTERS}`);
  for (let character in user.characters) {
    let targetCharacterId = user.characters[character]["id"];
    let targetCharacterName = user.characters[character]["name"];

    //  Check if character should be deployed
    if (CHARACTERS.includes(targetCharacterName)) {
      logger.info(`Deploy ${targetCharacterName}`);
      runCharacter(targetCharacterId, targetCharacterName);
    }
  }
}

main();
