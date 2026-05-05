require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

app.post("/generate", (req, res) => {
  const { prompt } = req.body;

  let base;

  if (prompt.toLowerCase().includes("ai")) {
    base =
      "Artificial Intelligence (AI) is the simulation of human intelligence in machines that can learn and make decisions.";
  } else if (prompt.toLowerCase().includes("javascript")) {
    base =
      "JavaScript is a programming language used to create dynamic and interactive web applications.";
  } else {
    base = `The topic "${prompt}" involves key concepts and practical understanding.`;
  }

  res.json({
    A: base + " This is a short explanation.",
    B: base + " This explanation is more detailed, structured, and easier to understand."
  });
});

// fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});