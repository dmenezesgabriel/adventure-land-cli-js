import logger from "./logger.js";

//  Sleep for x seconds
async function sleep(seconds) {
  logger.info(`Sleeping for ${seconds} seconds`);
  const ms = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { sleep };
