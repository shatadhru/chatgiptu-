const chalk = require("chalk");
const server = require("./app");

const PORT = 8000 ;

server.listen(PORT, () => {
  console.clear();
  console.log(`🚀 Server is Running: ${chalk.green.bold(`http://localhost:${PORT}`)}`);
});

process.on("unhandledRejection", (err) => {
  console.error(chalk.red("❌ Error:"), err.message);
  process.exit(1);
});
