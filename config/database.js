// ─────────────────────────────────────────────────────────────
// 🌐 MongoDB Connection Utility
// ─────────────────────────────────────────────────────────────

const mongoose = require("mongoose");
const chalk = require("chalk");
require("dotenv").config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGOSE_URL);
    console.log(chalk.green.bold("\n 💫 MongoDB Connected Successfully!"));
  } catch (error) {
    console.log(chalk.red.bold("❌ MongoDB Connection Failed!"));
    console.error(chalk.red("   Reason:"), chalk.yellow(error.message));
    process.exit(1);
  }
};


module.exports = connectDb;
