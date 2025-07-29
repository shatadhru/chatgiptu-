const express = require("express");
const router = express.Router();
const printerror = require("../../utils/printerror")

router.post("/login", async (req, res) => {

const data = req.body ;
console.log(data)
  
  
});

router.post("/register", async (req, res) => {
   
});



module.exports = router;