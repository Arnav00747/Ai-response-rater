document.addEventListener("DOMContentLoaded", () => {
  const promptInput = document.getElementById("prompt-input");
  const generateBtn = document.getElementById("generate-btn");
  const responseAContent = document.getElementById("response-a-content");
  const responseBContent = document.getElementById("response-b-content");
  const comparisonSection = document.getElementById("comparison-section");

  const selectBtns = document.querySelectorAll(".select-btn");
  const selectedLabel = document.getElementById("selected-label");
  const submitBtn = document.getElementById("submit-btn");

  const stars = document.querySelectorAll("#star-rating span");
  const feedbackInput = document.getElementById("feedback-input");
  const tableBody = document.getElementById("table-body");

  const exportBtn = document.getElementById("export-btn");

  let selectedChoice = null;
  let rating = 0;

  // 🔥 GENERATE RESPONSE
  generateBtn.addEventListener("click", async () => {
    const text = promptInput.value.trim();

    if (!text) {
      alert("Please enter a prompt first.");
      return;
    }

    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: text })
      });

      const data = await res.json();

      // show section
      comparisonSection.classList.remove("hidden");

      // set responses
      responseAContent.textContent = data.A;
      responseBContent.textContent = data.B;

      // reset previous state
      selectedChoice = null;
      rating = 0;
      selectedLabel.textContent = "None";
      submitBtn.disabled = true;

      stars.forEach((s) => (s.style.color = "gray"));

    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  });

  // 🔥 SELECT A/B
  selectBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedChoice = btn.innerText.includes("A") ? "A" : "B";
      selectedLabel.textContent = selectedChoice;

      // highlight selected
      selectBtns.forEach(b => b.style.background = "");
      btn.style.background = "#444";

      submitBtn.disabled = false;
    });
  });

  // ⭐ RATING
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      rating = star.getAttribute("data-value");

      stars.forEach((s) => {
        s.style.color =
          s.getAttribute("data-value") <= rating ? "gold" : "gray";
      });
    });
  });

  // 📥 SUBMIT
  submitBtn.addEventListener("click", () => {
    if (!selectedChoice || !rating) {
      alert("Select response and rating first!");
      return;
    }

    const row = `
      <tr>
        <td>${promptInput.value}</td>
        <td>${selectedChoice}</td>
        <td>${rating}</td>
        <td>${feedbackInput.value}</td>
      </tr>
    `;

    tableBody.innerHTML += row;

    alert("Submitted ✅");

    // reset
    submitBtn.disabled = true;
    selectedChoice = null;
    rating = 0;
    selectedLabel.textContent = "None";
    feedbackInput.value = "";
    stars.forEach((s) => (s.style.color = "gray"));
  });

  // 📤 EXPORT JSON
  exportBtn.addEventListener("click", () => {
    const rows = document.querySelectorAll("#table-body tr");

    if (rows.length === 0) {
      alert("No data to export!");
      return;
    }

    const data = [];

    rows.forEach((row) => {
      const cols = row.querySelectorAll("td");

      data.push({
        prompt: cols[0].innerText,
        choice: cols[1].innerText,
        rating: cols[2].innerText,
        feedback: cols[3].innerText
      });
    });

    const jsonData = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "submissions.json";
    a.click();

    URL.revokeObjectURL(url);
  });
});