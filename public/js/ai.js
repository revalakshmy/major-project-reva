// Elements
const aiBtn = document.getElementById("ai-btn");
const aiModalBg = document.getElementById("ai-modal-bg");
const aiGenerateBtn = document.getElementById("ai-generate");
const aiFormSection = document.getElementById("ai-form-section");
const aiResultSection = document.getElementById("ai-result-section");
const aiOutputText = document.getElementById("ai-output-text");
const aiDownloadBtn = document.getElementById("ai-download");
const aiBackBtn = document.getElementById("ai-back");

// Open modal
aiBtn.addEventListener("click", () => {
    aiModalBg.style.display = "flex";
    aiFormSection.style.display = "block";
    aiResultSection.classList.add("ai-output-hidden");
});

// Close modal when clicking outside
aiModalBg.addEventListener("click", (e) => {
    if (e.target.id === "ai-modal-bg") {
        aiModalBg.style.display = "none";
    }
});

// Generate itinerary
aiGenerateBtn.addEventListener("click", async () => {
    const location = document.getElementById("ai-location").value;
    const budget = document.getElementById("ai-budget").value;
    const start = document.getElementById("ai-start").value;
    const end = document.getElementById("ai-end").value;
    const pref = document.getElementById("ai-pref").value;

    if (!location || !budget || !start || !end) {
        alert("Please fill destination, budget and dates.");
        return;
    }

    const payload = { location, budget, start, end, pref };

    try {
        const response = await fetch("/ai/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        aiOutputText.innerHTML = (data.itinerary || "No itinerary generated.")
            .replace(/\n/g, "<br>");

        aiFormSection.style.display = "none";
        aiResultSection.classList.remove("ai-output-hidden");

    } catch (error) {
        aiOutputText.innerHTML = "Error generating itinerary.";
        aiFormSection.style.display = "none";
        aiResultSection.classList.remove("ai-output-hidden");
    }
});

aiDownloadBtn.addEventListener("click", () => {
    const element = document.getElementById("ai-output-text");  // FULL text, no scroll

    const opt = {
        margin:       10,
        filename:     "itinerary.pdf",
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(opt).from(element).save();
});


// Back to form
aiBackBtn.addEventListener("click", () => {
    aiResultSection.classList.add("ai-output-hidden");
    aiFormSection.style.display = "block";
});

// Removed broken code:
// document.getElementById("downloadBtn")
// document.getElementById("itineraryBox")
// (these IDs do not exist and were breaking the script)
