const axios = require("axios");

async function sendSMS(number, message) {
  try {
    await axios.post("https://api.dialog.lk/sms/send", {
      message: message,
      destinationAddresses: [number]
    }, {
      headers: {
        Authorization: "APP_068022" // Add your Dialog API token here
      }
    });

    console.log("SMS sent:", number);
  } catch (err) {
    console.log("SMS error:", err.response?.data || err.message);
  }
}

module.exports = sendSMS;