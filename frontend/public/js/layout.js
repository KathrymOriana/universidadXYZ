/* =============================================
   layout.js — Sidebar, avatares con color, utilidades
   compartidas en todas las páginas
   ============================================= */

/* ── Toggle sidebar en mobile ── */
function toggleSidebarMobile() {
    document.getElementById("sidebar").classList.toggle("open");
    document.getElementById("sidebarOverlay").classList.toggle("show");
}

function closeSidebarMobile() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebarOverlay").classList.remove("show");
}

/* ── Toggle sidebar colapsado (desktop) ── */
function toggleSidebarCollapse() {
    const isCollapsed = document.body.classList.toggle("sidebar-collapsed");
    localStorage.setItem("sidebar-collapsed", isCollapsed ? "1" : "0");
}

/* Restaurar preferencia al cargar (solo en desktop) */
(function restoreSidebarState() {
    if (
        window.innerWidth > 900 &&
        localStorage.getItem("sidebar-collapsed") === "1"
    ) {
        document.body.classList.add("sidebar-collapsed");
    }
})();

/* ── Generador de color consistente por persona/curso ── */
const AVATAR_PALETTE = [
    ["#1d4ed8", "#3b82f6"],
    ["#7e22ce", "#a855f7"],
    ["#0f766e", "#14b8a6"],
    ["#b45309", "#f59e0b"],
    ["#be123c", "#fb7185"],
    ["#15803d", "#22c55e"],
    ["#0f2044", "#3b82d4"],
    ["#9f1239", "#f43f5e"],
    ["#854d0e", "#eab308"],
    ["#4338ca", "#818cf8"],
    ["#0e7490", "#22d3ee"],
    ["#a16207", "#facc15"],
];

function hashSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

function getAvatarGradient(seed) {
    const [c1, c2] = AVATAR_PALETTE[hashSeed(seed) % AVATAR_PALETTE.length];
    return `linear-gradient(135deg, ${c1}, ${c2})`;
}

/* ── Fecha actual en topbar ── */
function setCurrentDate() {
    const el = document.getElementById("current-date");
    if (!el) return;
    const now = new Date();
    el.dateTime = now.toISOString();
    el.textContent = now.toLocaleDateString("es-PE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

document.addEventListener("DOMContentLoaded", setCurrentDate);
