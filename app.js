const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
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

// Helmet with CSP allowing unsafe-inline scripts (not recommended for prod, but works)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],  // <-- এখানে unsafe-inline add করলাম
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "ws:"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

// Middlewares
app.use(express.json());
app.use(hpp());
app.use(compression());

// Sanitize requests
app.use((req, res, next) => {
  req.body = sanitize(req.body);
  req.query = sanitize({ ...req.query });
  next();
});

// Rate limiter (optional)
/*
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
*/

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

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = server;
