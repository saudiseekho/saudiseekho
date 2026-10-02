// REPLACE every entry with the exact book content. Nothing below is real lesson content.
const curriculum = Array.from({ length: 60 }, (_, i) => ({
  day: i + 1,
  title: "EDIT WITH ACTUAL BOOK CONTENT",
  objective: "EDIT: learning objective for this day.",
  practice: "EDIT: practice activity for this day."
}));
(function () {
  const el = document.getElementById("cur"); if (!el) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  el.innerHTML = curriculum.map(d => `<details class="acc"><summary>Day ${d.day}: ${esc(d.title)}</summary><p><b>Objective:</b> ${esc(d.objective)}</p><p><b>Practice:</b> ${esc(d.practice)}</p></details>`).join("");
})();
