// ────────────────────────────── ⚙️ JSON WEBTOKEN VALIDDATIONS ──────────────────────────────

const jwt = require("jsonwebtoken");

const validatejwt = (req, res, next) => {

const authHeader = req.header.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {
   return res.status(401).json({ error: "No token provided" });
}

const token = authHeader.split(" ")[1];


// ─── Validate the JSON WEB TOKEN ───────────────────────────────────────────────


try {
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   req.user = decoded; 
   next();

} catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
}}

module.exports = validatejwt ;