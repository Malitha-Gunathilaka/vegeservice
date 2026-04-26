const express = require("express");
const router = express.Router();
const db = require("../db");
const sendSMS = require("../sms");

// Add daily prices
router.post("/add-prices", (req, res) => {
  const { prices } = req.body; // [{item, price}]

  const today = new Date().toISOString().split("T")[0];

  prices.forEach(p => {
    db.query(
      "INSERT INTO prices (item, price, date) VALUES (?, ?, ?)",
      [p.item, p.price, today]
    );
  });

  res.send("Prices added");
});

// Send SMS manually
router.get("/send-sms", (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  db.query(
    "SELECT * FROM prices WHERE date = ?",
    [today],
    (err, prices) => {
      if (err) return res.send(err);

      let message = "🥕 Daily Veg Prices\n\n";

      prices.forEach(p => {
        message += `${p.item} - Rs.${p.price}\n`;
      });

      db.query("SELECT * FROM customers", (err, users) => {
        users.forEach(u => {
          sendSMS(u.phone, message);
        });
      });

      res.send("SMS sent");
    }
  );
});

module.exports = router;