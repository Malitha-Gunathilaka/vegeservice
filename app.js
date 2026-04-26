const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");

const smsRoutes = require("./routes/smsRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", smsRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("IdaMart SMS System Running");
});


// ⏰ AUTO SEND DAILY (8 AM)
const db = require("./db");
const sendSMS = require("./sms");

cron.schedule("0 8 * * *", () => {
  console.log("Running daily SMS job...");

  const today = new Date().toISOString().split("T")[0];

  db.query("SELECT * FROM prices WHERE date = ?", [today], (err, prices) => {
    if (err) return;

    let message = "🥕 Daily Veg Prices\n\n";

    prices.forEach(p => {
      message += `${p.item} - Rs.${p.price}\n`;
    });

    db.query("SELECT * FROM customers", (err, users) => {
      users.forEach(u => {
        sendSMS(u.phone, message);
      });
    });
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});