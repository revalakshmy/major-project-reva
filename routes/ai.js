require("dotenv").config();
const express = require("express");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==============================
// GENERATE ITINERARY
// ==============================
router.post("/generate", async (req, res) => {
    console.log("🔥 AI Route hit!");

    const { location, budget, start, end, pref } = req.body;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const prompt = `
Create a beautifully structured day-wise travel itinerary.

Location: ${location}
Budget: ${budget} USD
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
- Approx Cost:

# Day 2: <Title>
(same structure)

---

# Total Budget Summary
- Stay:
- Food:
- Activities:
- Transport:
- Grand Total (≤ ${budget} USD)
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
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=itinerary.pdf"
        );

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
