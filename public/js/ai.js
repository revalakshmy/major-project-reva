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
    const location = document.getElementById("ai-location").value.trim();
    let budgetRaw = document.getElementById("ai-budget").value.trim();
    const start = document.getElementById("ai-start").value;
    const end = document.getElementById("ai-end").value;
    const pref = document.getElementById("ai-pref").value.trim();

    if (!location || !budgetRaw || !start || !end) {
      alert("Please fill destination, budget and dates.");
      return;
    }

    // Normalize budget: remove commas, currency symbols, parse as number (INR)
    budgetRaw = budgetRaw.replace(/[,\s₹$]/g, "");
    const budgetNum = Number(budgetRaw);

    if (!isFinite(budgetNum) || budgetNum <= 0) {
      alert("Please enter a valid positive numeric budget in INR.");
      return;
    }

    try {
      // send budget as number (INR)
      const response = await fetch("/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, budget: budgetNum, start, end, pref }),
      });

      const data = await response.json();

      // Show returned itinerary (AI will include ₹ in its text)
      aiOutputText.innerHTML = (data.itinerary || "No itinerary generated.").replace(/\n/g, "<br>");

      aiFormSection.style.display = "none";
      aiResultSection.classList.remove("ai-output-hidden");
    } catch (error) {
      aiOutputText.innerHTML = "Error generating itinerary.";
      aiFormSection.style.display = "none";
      aiResultSection.classList.remove("ai-output-hidden");
      console.error("AI frontend error:", error);
    }
  });

  // ----- DOWNLOAD PDF -----
  aiDownloadBtn.addEventListener("click", () => {
    const element = document.getElementById("ai-output-text");

    // 1️⃣ Save current mode
    const body = document.body;
    const wasDark = body.classList.contains("dark-mode");

    // 2️⃣ TEMPORARILY disable dark mode for clean PDF
    if (wasDark) {
      body.classList.remove("dark-mode");
    }

    // 3️⃣ Add a clean background & text color for PDF capture
    element.style.background = "white";
    element.style.color = "black";
    element.style.padding = "20px";
    element.style.borderRadius = "10px";

    const opts = {
      margin: 10,
      filename: "itinerary.pdf",
      html2canvas: { scale: 2, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf()
      .set(opts)
      .from(element)
      .save()
      .then(() => {
        // 4️⃣ Restore dark mode if it was enabled
        if (wasDark) {
          body.classList.add("dark-mode");
        }

        // 5️⃣ Restore original style
        element.style.background = "";
        element.style.color = "";
        element.style.padding = "";
        element.style.borderRadius = "";
      }).catch(err => {
        console.error("PDF generation error:", err);
      });
  });

  // ----- BACK BUTTON -----
  aiBackBtn.addEventListener("click", () => {
    aiResultSection.classList.add("ai-output-hidden");
    aiFormSection.style.display = "block";
  });

}); // END DOMContentLoaded
