require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;
const GRID_SIZE = 1000;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/api/pixels", async (req, res) => {
  const { page = 1, limit = 1000 } = req.query; // Defaults if not provided
  const offset = (page - 1) * limit;

  try {
    console.log("Received request for /api/pixels");

    const [rows] = await db.query("SELECT * FROM Pixels LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);
    console.log("Pixels fetched:", rows.length);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching pixels:", err);
    res.status(500).json({ error: err.message });
  }
});

// API route to handle pixel updates
app.post("/api/update-pixels", async (req, res) => {
  const { pixels, owner, imageUrl } = req.body;

  try {
    for (const { x, y } of pixels) {
      const [rows] = await db.query(
        "SELECT * FROM Pixels WHERE x = ? AND y = ? AND is_owned = FALSE",
        [x, y]
      );
      if (rows.length === 0) {
        return res.status(400).json({
          error: `Pixel at (${x}, ${y}) is already owned or not found`,
        });
      }

      await db.query(
        "UPDATE Pixels SET owner = ?, image_url = ?, is_owned = TRUE WHERE x = ? AND y = ?",
        [owner, imageUrl, x, y]
      );
    }

    res.json({ message: "Pixels updated successfully" });
  } catch (err) {
    console.error("Error updating pixels:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
