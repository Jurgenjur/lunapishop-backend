const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Pi Network API
const PI_API_BASE = "https://api.testnet.minepi.com";

// Health check
app.get("/", (req, res) => {
  res.json({
    app: "LunaPiShop Backend",
    network: "Pi Testnet",
    status: "online"
  });
});

// Approve payment
app.post("/api/payments/approve", async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        error: "paymentId is required"
      });
    }

    const response = await axios.post(
      `${PI_API_BASE}/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(
      "Approve error:",
      error.response?.data || error.message
    );

    res.status(
      error.response?.status || 500
    ).json({
      error: error.response?.data || error.message
    });
  }
});

// Complete payment
app.post("/api/payments/complete", async (req, res) => {
  try {
    const { paymentId, txid } = req.body;

    if (!paymentId || !txid) {
      return res.status(400).json({
        error: "paymentId and txid are required"
      });
    }

    const response = await axios.post(
      `${PI_API_BASE}/v2/payments/${paymentId}/complete`,
      {
        txid: txid
      },
      {
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(
      "Complete error:",
      error.response?.data || error.message
    );

    res.status(
      error.response?.status || 500
    ).json({
      error: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `LunaPiShop backend running on port ${PORT}`
  );
});