const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const compression = require("compression");
const cors = require("cors");
const sanitize = require("./utils/sanitize");
const path = require("path");
const connectDb = require("./config/database");
const http = require("http");

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(hpp());
app.use(compression());

// // Sanitize requests
// app.use((req, res, next) => {
//   req.body = sanitize(req.body);
//   req.query = sanitize({ ...req.query });
//   next();
// });

// Rate limiter (optional)
/*
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
*/

// ─── SESSION STORE ───────────────────────────────────────────────

const sessionStore = {};
app.locals.sessionStore = sessionStore;


// Session cleanup logic
const SESSION_TIMEOUT = 1000 * 60 * 60; // ১ ঘন্টা inactivity

setInterval(() => {
  const now = Date.now();
  const sessionStore = app.locals.sessionStore;

  for (const userId in sessionStore) {
    if (sessionStore[userId].lastActive && now - sessionStore[userId].lastActive > SESSION_TIMEOUT) {
      console.log(`Session expired for userId: ${userId}, clearing session.`);
      delete sessionStore[userId];
    }
  }
}, 1000 * 60 * 5); // প্রতি ৫ মিনিটে চেক করবে


// Logging & CORS
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  cors({
    origin: ["http://localhost:3000" , "https://chatgiptu.onrender.com" , "https://shatadhru.shop" ,"https://zaroo.ai.shatadhru.shop"],
    credentials: true,
  })
);

// Connect MongoDB
connectDb();

// Routes
app.use("/auth", require("./routes/Authentication/auth"));
app.use("/admin", require("./routes/Admin/Admin"));
app.use("/ehacker", require("./routes/EthicalHacker/EthicalHacker"));
app.use("/profile", require("./routes/ProfileManagement/ProfileManagement"));
app.use("/data", require("./routes/Data/basicData"));
app.use("/chat", require("./routes/chat/artificialIntelligence"));


// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// Default route – serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


module.exports = server;
