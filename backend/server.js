require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

function rgbaToHex(rgba) {
  // Extract the rgba values using a regular expression
  const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)$/.exec(
    rgba
  );
  if (!result) {
    return null; // Return null if not a valid rgba string
  }

  const r = parseInt(result[1], 10);
  const g = parseInt(result[2], 10);
  const b = parseInt(result[3], 10);

  // Convert to hex and return
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

app.get("/api/pixels", async (req, res) => {
  try {
    console.log("Received request for /api/pixels");

    const rows = await db("Pixels");
    console.log("Pixels fetched:", rows.length);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching pixels:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/update-pixels", async (req, res) => {
  const { pixels, owner } = req.body;

  console.log("Received pixels for update:", pixels);
  console.log("Owner ID:", owner);

  try {
    await db.transaction(async (trx) => {
      for (const { x, y, color } of pixels) {
        const hexColor = rgbaToHex(color);
        if (hexColor) {
          const result = await trx("Pixels").where({ x, y }).update({
            color: hexColor,
            owner,
            is_owned: true,
          });

          if (result === 0) {
            console.warn(`Pixel at (${x}, ${y}) not found or already owned.`);
          }
        } else {
          console.warn(
            `Invalid color format for pixel at (${x}, ${y}): ${color}`
          );
        }
      }
    });

    res.json({ message: "Pixels updated successfully" });
  } catch (err) {
    console.error("Error updating pixels:", err);
    res.status(500).json({ error: "Error updating pixels" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
