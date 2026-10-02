(function () {
  const C = SITE_CONFIG, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  document.documentElement.classList.add("js");
  const links = [["index.html", "Home"], ["about.html", "About"], ["curriculum.html", "Curriculum"], ["what-you-learn.html", "What you’ll learn"], ["lessons.html", "Samples"], ["reviews.html", "Reviews"], ["faq.html", "FAQ"], ["contact.html", "Contact"]];
  const cur = location.pathname.split("/").pop() || "index.html";
  const wa = (t) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(t || "Hi SaudiSeekho, I have a question about " + C.productName + ".")}`;
  $("#hdr").innerHTML = `<div class="wrap bar"><a class="brand" href="index.html" aria-label="SaudiSeekho home"><img src="assets/logo.svg" alt="" width="36" height="36">SaudiSeekho</a><button id="tg" class="icon" aria-label="Toggle dark mode">◐</button><button id="mb" class="icon" aria-expanded="false" aria-controls="nav" aria-label="Open menu">☰</button><nav id="nav" aria-label="Main">${links.map(([h, t]) => `<a href="${h}"${h === cur ? ' aria-current="page"' : ""}>${t}</a>`).join("")}<a class="btn sm" href="checkout.html">Buy — <span data-price></span></a></nav></div>`;
  $("#ftr").innerHTML = `<div class="wrap"><img src="assets/logo.svg" alt="" width="40" height="40"><h2>SaudiSeekho</h2><p>Your 60-Day Roadmap to Speaking Najdi Arabic.</p><nav class="fnav" aria-label="Footer">${links.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</nav><nav class="fnav" aria-label="Legal"><a href="terms.html">Terms</a><a href="privacy.html">Privacy</a><a href="refund-policy.html">Refund policy</a><a href="contact.html">Contact</a><a data-wa href="#">WhatsApp</a></nav><p class="fine">Digital ebook. No guaranteed fluency or results. © ${new Date().getFullYear()} SaudiSeekho</p></div>`;
  document.body.insertAdjacentHTML("beforeend", `<a class="wa" data-wa target="_blank" rel="noopener" aria-label="Chat on WhatsApp" href="#"><svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.2 14.1c-.2.6-1.3 1.200-1.800 1.200-.5.1-1 .2-3.300-.7-2.800-1.100-4.500-3.900-4.700-4.100-.1-.2-1.1-1.500-1.100-2.800s.7-2 1-2.300c.2-.3.500-.3.700-.3h.5c.2 0 .4 0 .6.500l.8 1.900c.1.200.1.400 0 .6l-.4.600c-.1.200-.3.300-.1.600.2.300.8 1.3 1.700 2.100 1.100 1 2.100 1.3 2.400 1.500.3.100.5.100.6-.1l.9-1.100c.2-.3.400-.2.600-.1l1.800.9c.3.100.4.200.5.300 0 .1 0 .6-.2 1.200z"/></svg></a>`);
  $$("[data-wa]").forEach((a) => { a.href = wa(); a.target = "_blank"; a.rel = "noopener"; });
  const fw = $("#faqwa"); if (fw) { fw.href = wa(); fw.target = "_blank"; fw.rel = "noopener"; }
  $("#tg").onclick = () => { const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = t; try { localStorage.setItem("theme", t); } catch (e) {} };
  const mb = $("#mb"), nav = $("#nav");
  mb.onclick = () => { const o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", o); mb.setAttribute("aria-label", o ? "Close menu" : "Open menu"); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); mb.setAttribute("aria-expanded", false); mb.focus(); } });
  // Display pricing only; the Worker computes the real amount.
  const end = Date.parse(C.launchEndDate), live = () => Date.now() < end;
  const sym = C.currency === "INR" ? "₹" : C.currency + " ", money = (n) => sym + Number(n).toLocaleString("en-IN");
  const fill = (sel, v) => $$(sel).forEach((e) => (e.textContent = v));
  // Display only. The Worker alone decides the real payable amount.
  const paint = () => {
    fill("[data-price]", money(live() ? C.launchPrice : C.regularPrice)); fill("[data-regular]", money(C.regularPrice)); fill("[data-launch]", money(C.launchPrice));
    fill("[data-save]", money(C.regularPrice - C.launchPrice));
    fill("[data-launch-end]", Number.isFinite(end) ? new Date(end).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }) : "");
    $$(".launch-only").forEach((e) => (e.hidden = !live()));
  };
  const tick = () => { paint(); if (!live()) return; const s = Math.max(0, Math.floor((end - Date.now()) / 1000)), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60); $$("[data-countdown]").forEach((e) => (e.textContent = `${d}d ${h}h ${m}m ${s % 60}s`)); };
  tick(); if (live()) setInterval(tick, 1000);
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.12 }) : null;
  $$(".rv").forEach((e) => (io ? io.observe(e) : e.classList.add("in")));
  const lb = $("#lb"); if (lb) { const img = $("img", lb); $$(".shot").forEach((b) => (b.onclick = () => { img.src = b.dataset.full; lb.showModal(); })); $("#lbx").onclick = () => lb.close(); lb.onclick = (e) => { if (e.target === lb) lb.close(); }; }
  const cp = $("#cpy"); if (cp) cp.onclick = async () => { try { await navigator.clipboard.writeText(C.upiId); cp.textContent = "Copied"; } catch (e) { cp.textContent = "Select and copy manually"; } };
})();
