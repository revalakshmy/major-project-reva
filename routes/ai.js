require("dotenv").config();
const express = require("express");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");
console.log("🔍 DEBUG: GEMINI KEY IN ai.js:", process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log("Gemini Key Loaded?:", process.env.GEMINI_API_KEY ? "YES" : "NO");

// ==============================
// GENERATE ITINERARY
// ==============================
router.post("/generate", async (req, res) => {
  console.log("🔥 AI Route hit!");

  // Expecting budget already provided in INR from frontend
  const { location, budget, start, end, pref } = req.body;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    // Make sure budget is shown / interpreted as INR in the prompt
    const safeBudget = typeof budget === "number" ? budget : String(budget);

    const prompt = `
Create a beautifully structured day-wise travel itinerary for a traveller. 
All cost estimates and the summary must be in Indian Rupees (INR). Do NOT include USD or any other currency.

Location: ${location}
Budget: ₹${safeBudget} INR
Dates: ${start} to ${end}
Preferences: ${pref}

Format exactly like this:

# Trip Overview
(2–3 lines)

---

# Day 1: <Title>
- Morning:
- Afternoon:
- Evening:
- Meals:
- Approx Cost (in ₹):

# Day 2: <Title>
(same structure)

---

# Total Budget Summary (ALL AMOUNTS IN ₹)
- Stay:
- Food:
- Activities:
- Transport:
- Grand Total (≤ ₹${safeBudget} INR)

Keep the itinerary actionable, realistic, and ensure the Grand Total does not exceed ₹${safeBudget} INR.
        `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.json({ itinerary: text });
  } catch (err) {
    console.error("❌ BACKEND ERROR:", err);

    return res.json({
      itinerary: `
Could not generate itinerary.
<br>Error: ${err.message}
            `,
    });
  }
});

// ==============================
// DOWNLOAD PDF
// ==============================
router.post("/pdf", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send("No itinerary text provided");
  }

  try {
    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();
    const chunks = [];

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=itinerary.pdf");

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.end(pdfBuffer);
    });

    doc.fontSize(12).text(text, { align: "left" });
    doc.end();
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).send("Failed to generate PDF");
  }
});

module.exports = router;

