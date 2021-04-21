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

//  Sleep for x seconds
async function sleep(seconds) {
  logger.info(`Sleeping for ${seconds} seconds`);
  const ms = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Deploy character
async function main() {
  logger.info(`Starting`);

  //  Set browser
  const browser = await puppeteer.launch({
    // Set to run without a graphic interface
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

  // Login
  const page = await context.newPage();
  logger.info(`Go to ${baseUrl}`);
  await page.goto(baseUrl);
  await sleep(5);
  await page.evaluate(
    "$('#loginbuttons').hide(); $('#loginlogin').show(); on_resize()"
  );
  await sleep(2);
  logger.info(`Fill credentials`);
  await page.type("#email2", EMAIL);
  await page.type("#password2", PASSWORD);
  logger.info(`Click login`);
  await page.evaluate(
    "api_call_l('signup_or_login',{email:$('#email2').val(),password:$('#password2').val(),only_login:true},{disable:$(this)})"
  );
  await sleep(2);

  //  Close the page
  (async () => {
    await sleep(5);
    page.close();
  })();

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
  console.log(`Characters: ${characters}`);

  // Run
  logger.info(`Deploy each character`);
  for (const char of characters) {
    logger.info(`Starting - ${char.name}`);
    const page = await context.newPage();
    await page.goto(baseUrl);
    await sleep(5);
    await page.evaluate(char.loginJS); // select character
    await sleep(5);
    logger.info(`Escape`);
    await page.keyboard.press("Escape"); // close menu
    await sleep(1);
    logger.info(`Backslash - Running CODE`);
    await page.keyboard.press("Backslash"); // run code
  }
}

await main();
