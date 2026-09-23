// ===== Config — edit these when the token is live =====
const CONTRACT_ADDRESS = ""; // e.g. "0x1234...abcd" once launched on long.xyz

const ALLOCATIONS = [
  { name: "long.xyz Fair Launch", desc: "Bonding curve → $META pool, LP burned", pct: 80, color: "#d9b894" },
  { name: "$META Holder Shrug-drop", desc: "Airdrop to $META holders on Robinhood Chain", pct: 5, color: "#e99a9a" },
  { name: "Shrug Treasury", desc: "Community memes, contests & plushies (multisig)", pct: 5, color: "#f7d6d6" },
  { name: "Listings Reserve", desc: "Future listings & liquidity", pct: 5, color: "#b98b73" },
  { name: "Marketing", desc: "KOLs, stickers & making noise", pct: 5, color: "#6b4636" },
];

// ===== Contract address =====
const caAddr = document.getElementById("caAddr");
const toast = document.getElementById("toast");
if (CONTRACT_ADDRESS) caAddr.textContent = CONTRACT_ADDRESS;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("show"), 1800);
}

document.getElementById("copyCa").addEventListener("click", async () => {
  if (!CONTRACT_ADDRESS) return showToast("CA drops at launch 🤷");
  try {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS);
    showToast("Copied! 🤷");
  } catch {
    showToast("Copy failed — select it manually");
  }
});

// ===== Mobile nav =====
const navLinks = document.getElementById("navLinks");
document.getElementById("burger").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));

// ===== Mascot shrug =====
const mascot = document.getElementById("mascot");
const bubble = document.getElementById("bubble");
const countEl = document.getElementById("shrugCount");
const LINES = [
  "idk man 🤷", "chart down? 🤷", "chart up? 🤷🤷", "paired with $META btw",
  "wen moon? 🤷", "still felt, still fine", "robinhood chain comfy", "0% tax, 100% shrug",
  "who sold? 🤷", "just vibing", "stay soft", "gm 🧶",
];
let shrugs = 0;
try { shrugs = parseInt(localStorage.getItem("musejak-shrugs") || "0", 10) || 0; } catch {}
countEl.textContent = shrugs.toLocaleString();

mascot.addEventListener("click", () => {
  mascot.classList.remove("shrug");
  void mascot.offsetWidth; // restart animation
  mascot.classList.add("shrug");
  bubble.textContent = LINES[Math.floor(Math.random() * LINES.length)];
  shrugs++;
  countEl.textContent = shrugs.toLocaleString();
  try { localStorage.setItem("musejak-shrugs", String(shrugs)); } catch {}
});

// ===== Tokenomics donut =====
const svg = document.getElementById("donut");
const list = document.getElementById("alloc");
const pctEl = document.getElementById("donutPct");
const nameEl = document.getElementById("donutName");
const R = 80;
const C = 2 * Math.PI * R;
const NS = "http://www.w3.org/2000/svg";

const track = document.createElementNS(NS, "circle");
Object.entries({ cx: 110, cy: 110, r: R, fill: "none", stroke: "#fffaf5", "stroke-width": 34 })
  .forEach(([k, v]) => track.setAttribute(k, v));
svg.appendChild(track);

let offset = 0;
const segs = ALLOCATIONS.map((a, i) => {
  const len = (a.pct / 100) * C;
  const c = document.createElementNS(NS, "circle");
  Object.entries({
    cx: 110, cy: 110, r: R, fill: "none", stroke: a.color, "stroke-width": 30,
    "stroke-dasharray": `${Math.max(len - 2, 0)} ${C}`, "stroke-dashoffset": -offset,
    class: "seg",
  }).forEach(([k, v]) => c.setAttribute(k, v));
  offset += len;
  c.addEventListener("mouseenter", () => highlight(i));
  c.addEventListener("mouseleave", () => highlight(-1));
  svg.appendChild(c);

  const li = document.createElement("li");
  li.innerHTML = `
    <span class="alloc__dot" style="background:${a.color}"></span>
    <span class="alloc__name">${a.name}<span class="alloc__desc">${a.desc}</span></span>
    <span class="alloc__pct">${a.pct}%</span>`;
  li.addEventListener("mouseenter", () => highlight(i));
  li.addEventListener("mouseleave", () => highlight(-1));
  li.addEventListener("click", () => highlight(i));
  list.appendChild(li);
  return { c, li };
});

function highlight(idx) {
  segs.forEach(({ c, li }, i) => {
    c.classList.toggle("active", i === idx);
    c.classList.toggle("dim", idx !== -1 && i !== idx);
    li.classList.toggle("active", i === idx);
  });
  if (idx === -1) {
    pctEl.textContent = "1B";
    nameEl.textContent = "$MUSEJAK";
  } else {
    pctEl.textContent = ALLOCATIONS[idx].pct + "%";
    nameEl.textContent = ALLOCATIONS[idx].name;
  }
}

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll(".section-title, .section-sub, .felt-card, .alloc li, .donut-wrap");
revealEls.forEach((el) => el.classList.add("reveal"));
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
revealEls.forEach((el) => io.observe(el));
