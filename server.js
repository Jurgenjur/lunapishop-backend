const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Pi Platform API
const PI_API_BASE = "https://api.minepi.com/v2";
const PI_API_KEY = process.env.PI_API_KEY;

// --------------------------------------------------
// BASIC STATUS
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    status: "online",
    app: "LunaPiShop Backend",
    network: "Pi Network",
    environment: "Testnet",
    message: "Backend is running successfully."
  });
});

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    piApiKeyConfigured: !!PI_API_KEY
  });
});

// --------------------------------------------------
// APPROVE PAYMENT
// --------------------------------------------------

app.post("/api/payments/approve", async (req, res) => {
  const { paymentId } = req.body;

  console.log("====================================");
  console.log("PAYMENT APPROVAL REQUEST");
  console.log("Payment ID:", paymentId);
  console.log("API Key configured:", !!PI_API_KEY);
  console.log("====================================");

  if (!paymentId) {
    console.error("ERROR: Missing paymentId");

    return res.status(400).json({
      success: false,
      error: "Missing paymentId"
    });
  }

  if (!PI_API_KEY) {
    console.error("ERROR: PI_API_KEY is missing from Render Environment Variables");

    return res.status(500).json({
      success: false,
      error: "PI_API_KEY is not configured on the server"
    });
  }

  try {
    const url = `${PI_API_BASE}/payments/${paymentId}/approve`;

    console.log("Calling Pi API:");
    console.log(url);

    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    console.log("Pi APPROVE response status:", response.status);
    console.log("Pi APPROVE response:", response.data);

    return res.status(response.status).json({
      success: true,
      piResponse: response.data
    });

  } catch (error) {

    console.error("====================================");
    console.error("PI APPROVAL ERROR");
    console.error("====================================");

    if (error.response) {
      console.error("HTTP Status:", error.response.status);
      console.error("Pi Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from Pi API");
      console.error(error.message);
    } else {
      console.error("Request error:", error.message);
    }

    const status = error.response?.status || 500;

    return res.status(status).json({
      success: false,
      error: "Pi payment approval failed",
      status: status,
      piResponse: error.response?.data || null,
      message: error.message
    });
  }
});

// --------------------------------------------------
// COMPLETE PAYMENT
// --------------------------------------------------

app.post("/api/payments/complete", async (req, res) => {
  const { paymentId, txid } = req.body;

  console.log("====================================");
  console.log("PAYMENT COMPLETION REQUEST");
  console.log("Payment ID:", paymentId);
  console.log("TXID:", txid);
  console.log("====================================");

  if (!paymentId) {
    console.error("ERROR: Missing paymentId");

    return res.status(400).json({
      success: false,
      error: "Missing paymentId"
    });
  }

  if (!txid) {
    console.error("ERROR: Missing txid");

    return res.status(400).json({
      success: false,
      error: "Missing txid"
    });
  }

  if (!PI_API_KEY) {
    console.error("ERROR: PI_API_KEY is missing");

    return res.status(500).json({
      success: false,
      error: "PI_API_KEY is not configured on the server"
    });
  }

  try {
    const url = `${PI_API_BASE}/payments/${paymentId}/complete`;

    console.log("Calling Pi COMPLETE API:");
    console.log(url);

    const response = await axios.post(
      url,
      {
        txid: txid
      },
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    console.log("Pi COMPLETE response status:", response.status);
    console.log("Pi COMPLETE response:", response.data);

    return res.status(response.status).json({
      success: true,
      piResponse: response.data
    });

  } catch (error) {

    console.error("====================================");
    console.error("PI COMPLETION ERROR");
    console.error("====================================");

    if (error.response) {
      console.error("HTTP Status:", error.response.status);
      console.error("Pi Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from Pi API");
      console.error(error.message);
    } else {
      console.error("Request error:", error.message);
    }

    const status = error.response?.status || 500;

    return res.status(status).json({
      success: false,
      error: "Pi payment completion failed",
      status: status,
      piResponse: error.response?.data || null,
      message: error.message
    });
  }
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log("====================================");
  console.log("LunaPiShop Backend");
  console.log("Server running on port:", PORT);
  console.log("Pi API:", PI_API_BASE);
  console.log("Network: Testnet");
  console.log("API Key configured:", !!PI_API_KEY);
  console.log("====================================");
});