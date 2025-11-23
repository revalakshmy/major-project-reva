document.addEventListener("DOMContentLoaded", () => {

    // Check if this page even has the AI button
    const aiBtn = document.getElementById("ai-btn");
    if (!aiBtn) {
        console.log("AI not active on this page.");
        return;
    }

    // ----- ELEMENTS -----
    const aiModalBg = document.getElementById("ai-modal-bg");
    const aiGenerateBtn = document.getElementById("ai-generate");
    const aiFormSection = document.getElementById("ai-form-section");
    const aiResultSection = document.getElementById("ai-result-section");
    const aiOutputText = document.getElementById("ai-output-text");
    const aiDownloadBtn = document.getElementById("ai-download");
    const aiBackBtn = document.getElementById("ai-back");

    // ----- OPEN MODAL -----
    aiBtn.addEventListener("click", () => {
        aiModalBg.style.display = "flex";
        aiFormSection.style.display = "block";
        aiResultSection.classList.add("ai-output-hidden");
    });

    // ----- CLOSE MODAL (click outside) -----
    aiModalBg.addEventListener("click", (e) => {
        if (e.target.id === "ai-modal-bg") {
            aiModalBg.style.display = "none";
        }
    });

    // ----- GENERATE ITINERARY -----
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

        try {
            const response = await fetch("/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ location, budget, start, end, pref }),
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

    // ----- DOWNLOAD PDF -----
    aiDownloadBtn.addEventListener("click", () => {
        const element = document.getElementById("ai-output-text");

        const opts = {
            margin: 10,
            filename: "itinerary.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(opts).from(element).save();
    });

    // ----- BACK BUTTON -----
    aiBackBtn.addEventListener("click", () => {
        aiResultSection.classList.add("ai-output-hidden");
        aiFormSection.style.display = "block";
    });

}); // END DOMContentLoaded
