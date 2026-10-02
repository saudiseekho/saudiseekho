// Talks ONLY to the Worker endpoints: /api/create-order, /api/verify, /api/access, /api/download-link.
(function () {
  const C = SITE_CONFIG, page = document.body.dataset.page, $ = (s) => document.querySelector(s);
  const api = async (path, body) => {
    try {
      const r = await fetch(C.apiBase + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      let data = {}; try { data = await r.json(); } catch (e) {}
      return { ok: r.ok, status: r.status, data };
    } catch (e) { return { ok: false, status: 0, data: { error: "Network error. Check your connection and try again." } }; }
  };
  const say = (m, k) => { const s = $("#status"); if (s) { s.textContent = m; s.className = "status " + (k || ""); } };
  const token = () => new URLSearchParams(location.hash.slice(1)).get("t"); // URL fragment: never sent to any server except via /api calls
  const loadRzp = () => window.Razorpay ? Promise.resolve() : new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = res; s.onerror = rej; document.head.appendChild(s); });

  if (page === "checkout") {
    const f = $("#co"), btn = $("#pay");
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(f)); Object.keys(v).forEach((k) => (v[k] = String(v[k]).trim()));
      if (v.name.length < 2) return say("Enter your full name.", "err");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) return say("Enter a valid email address.", "err");
      if (!/^\+?[0-9 ()-]{7,20}$/.test(v.phone)) return say("Enter a valid phone number with country code.", "err");
      if (v.country.length < 2) return say("Enter your country.", "err");
      btn.disabled = true; say("Creating your secure order…");
      // No amount is sent. The Worker prices the order.
      const o = await api("/api/create-order", { name: v.name, email: v.email, phone: v.phone, country: v.country, currency: C.currency, coupon: v.coupon || undefined });
      if (!o.ok) { btn.disabled = false; return say(o.data.error || "Could not start checkout. Try again.", "err"); }
      try { await loadRzp(); } catch (_) { btn.disabled = false; return say("Could not load the payment window. Check your connection and try again.", "err"); }
      let settled = false;
      const rz = new Razorpay({
        key: o.data.keyId, order_id: o.data.razorpayOrderId, amount: o.data.amount, currency: o.data.currency,
        name: C.brandName, description: C.productName, prefill: { name: v.name, email: v.email, contact: v.phone }, theme: { color: "#0b5d4b" },
        handler: async (r) => {
          settled = true; say("Verifying your payment…");
          const vr = await api("/api/verify", { razorpay_order_id: r.razorpay_order_id, razorpay_payment_id: r.razorpay_payment_id, razorpay_signature: r.razorpay_signature });
          if (vr.ok && vr.data.verified === true && vr.data.token) location.href = "payment-success.html#t=" + encodeURIComponent(vr.data.token);
          else { btn.disabled = false; say("We could not verify your payment yet. If money was debited, your access email will arrive once it is confirmed. Contact us on WhatsApp with Payment ID " + r.razorpay_payment_id + ".", "err"); }
        },
        modal: { ondismiss: () => { if (!settled) { btn.disabled = false; say("Checkout was closed. You have not been charged and no access was created."); } } }
      });
      rz.on("payment.failed", () => { settled = true; btn.disabled = false; say("Payment could not be completed. Select Pay securely to try again.", "err"); });
      say(""); rz.open();
    });
  }

  if (["success", "access", "download"].includes(page)) (async () => {
    const t = token(), show = (ok) => { $("#load").hidden = true; $(ok ? "#ok" : "#bad").hidden = false; };
    if (!t) return show(false);
    const a = await api("/api/access", { token: t }); // Worker validates HMAC + paid order
    if (!a.ok || a.data.valid !== true) return show(false);
    document.querySelectorAll("[data-order]").forEach((e) => (e.textContent = a.data.orderId));
    document.querySelectorAll("[data-product]").forEach((e) => (e.textContent = a.data.product));
    const n = $("#next"); if (n) n.href = n.dataset.to + "#t=" + encodeURIComponent(t);
    show(true);
    const dl = $("#dl");
    if (dl) dl.onclick = async () => {
      dl.disabled = true; say("Preparing your secure download…");
      const d = await api("/api/download-link", { token: t });
      dl.disabled = false;
      if (d.ok && d.data.url) { say(`Your download is starting. This link expires in ${Math.round(d.data.expiresInSeconds / 60)} minutes.`); location.href = d.data.url; }
      else say(d.data.error || "Could not create a download link. Contact support.", "err");
    };
  })();
})();
