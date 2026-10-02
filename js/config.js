// Non-secret settings only. Never put secret keys here.
const SITE_CONFIG = {
  brandName: "SaudiSeekho",
  productName: "Speak Najdi Arabic in 60 Days",
  siteUrl: "https://saudiseekho.com",
  // >>> PUT YOUR DEPLOYED WORKER URL HERE (no trailing slash) <<<
  apiBase: "https://saudiseekho-api.jmg4gsm5jw.workers.dev",
  currency: "INR",
  regularPrice: 999,          // display only; the Worker decides the real amount
  launchPrice: 499,           // display only
  launchEndDate: "2026-11-03T23:59:59+05:30", // keep identical to LAUNCH_END_ISO in wrangler.toml
  whatsapp: "917016249687",
  upiId: "7016249687@fam"
};
