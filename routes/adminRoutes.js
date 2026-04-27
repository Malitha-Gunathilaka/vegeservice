const express = require("express");
const router = express.Router();
const db = require("../db");
const sendSMS = require("../sms");

// Add prices
router.post("/add-prices", (req, res) => {
  const { prices } = req.body;
  const today = new Date().toISOString().split("T")[0];

  const stmt = db.prepare("INSERT INTO prices (item, price, date) VALUES (?, ?, ?)");

  prices.forEach(p => {
    stmt.run(p.item, p.price, today);
  });

  stmt.finalize();

  res.send("Prices added");
});

// Send SMS manually
router.get("/send-sms", (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  db.all("SELECT * FROM prices WHERE date = ?", [today], (err, prices) => {
    if (err) return res.send(err);

    let message = "🥕 Daily Veg Prices\n\n";

    prices.forEach(p => {
      message += `${p.item} - Rs.${p.price}\n`;
    });

    db.all("SELECT * FROM customers", [], (err, users) => {
      users.forEach(u => sendSMS(u.phone, message));
    });

    res.send("SMS sent");
  });
});

module.exports = router;
