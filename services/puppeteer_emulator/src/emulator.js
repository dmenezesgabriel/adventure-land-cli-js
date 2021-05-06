import logger from "./logger.js";
import puppeteer from "puppeteer";
import { sleep } from "./utils.js";

//  Log page logs
async function logPageConsole(page) {
  page.on("console", (msg) => logger.info(`Game log: ${msg.text()}`));
}

// Open browser
async function makeBrowserContext(headless) {
  logger.info("Creating browser context");

  //  Set browser
  const browser = await puppeteer.launch({
    // Set to run without a graphic interface
    headless: headless,
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

async function selectCharacters(user, selected_characters) {
  let characters = [];
  for (let character in user.characters) {
    let targetCharacterId = user.characters[character]["id"];
    let targetCharacterName = user.characters[character]["name"];

    //  Check if character should be deployed
    if (selected_characters.includes(targetCharacterName)) {
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

async function startCharacter(context, base_url, character, targetServer) {
  logger.info(`Starting - ${character.name}`);
  const page = await context.newPage();
  await page.goto(base_url);
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
async function login(context, base_url, email, password) {
  const page = await context.newPage();
  logger.info(`Go to ${base_url}`);
  await page.goto(base_url);
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

export {
  logPageConsole,
  makeBrowserContext,
  selectCharacters,
  startCharacter,
  login,
};
