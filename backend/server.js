require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db"); // Ensure this is correctly configured

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's address
    methods: ["GET", "POST"], // Specify the allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify the allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Example API route
app.get("/api/pixels", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Pixels");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching pixels:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
