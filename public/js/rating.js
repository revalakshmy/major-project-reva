// public/js/rating.js
document.addEventListener("DOMContentLoaded", function () {
  const starFieldset = document.querySelector(".starability-slot");
  if (!starFieldset) return;

  // Wrap plain text inside labels into a span (keeps it accessible but hides it visually)
  starFieldset.querySelectorAll("label").forEach(label => {
    const hasSpan = !!label.querySelector("span");
    if (!hasSpan) {
      // take any text nodes and wrap them in a span
      const textNodes = Array.from(label.childNodes).filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      if (textNodes.length) {
        const span = document.createElement("span");
        span.textContent = textNodes.map(n => n.textContent).join(" ").trim();
        textNodes.forEach(n => n.remove());
        label.appendChild(span);
      }
    }
  });

  const radios = Array.from(starFieldset.querySelectorAll('input[type="radio"][name="review[rating]"]'));

  function updateDataRating(val) {
    if (!val) starFieldset.removeAttribute("data-rating");
    else starFieldset.setAttribute("data-rating", String(val));
  }

  // set initial state if server pre-checks a radio
  const checked = radios.find(r => r.checked);
  if (checked) updateDataRating(checked.value);

  radios.forEach(r => {
    r.addEventListener("change", (e) => updateDataRating(e.target.value));
    r.addEventListener("keyup", () => { if (r.checked) updateDataRating(r.value); });
  });

  // support clearing if you have a "no-rate" radio
  const noRate = starFieldset.querySelector(".input-no-rate");
  if (noRate) noRate.addEventListener("change", () => { if (noRate.checked) updateDataRating(null); });
});
