// utils/printError.js

const chalk = require("chalk");

/**
 * Prints a clean, styled error block to console.
 * @param {string} title - The heading of the error.
 * @param {Error|string} err - The actual error object or string.
 */
function printError(title = "Unknown Error", err) {
  console.log(chalk.red.bold(`\n🚨 ${title}`));
  console.log(chalk.red("──────────────────────────────────────────────"));
  
  if (err instanceof Error) {
    console.log(chalk.yellow("🧾 Message:"), chalk.white(err.message));
    if (err.stack) {
      console.log(chalk.gray("📄 Stack Trace:\n") + chalk.gray(err.stack));
    }
  } else {
    console.log(chalk.yellow("🧾 Details:"), chalk.white(err));
  }

  console.log(chalk.red("──────────────────────────────────────────────\n"));
}

module.exports = printError;
