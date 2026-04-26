const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/smsmo", (req, res) => {
  const message = req.body.message;
  const mobile = req.body.sourceAddress;

  console.log("Incoming:", mobile, message);

  // Subscribe user
  if (message.toUpperCase().includes("veg")) {
    db.query(
      "INSERT IGNORE INTO customers (phone) VALUES (?)",
      [mobile],
      () => {
        console.log("Subscribed:", mobile);
      }
    );
  }

  res.json({
    statusCode: "S1000",
    statusDetail: "Success"
  });
});

module.exports = router;