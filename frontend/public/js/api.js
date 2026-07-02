/* =============================================
   api.js — Capa de comunicación con el backend
   Todo pasa por el API Gateway (puerto 3000)
   ============================================= */

const API_BASE = "/api/v1";
const GATEWAY_BASE = "";

const API = {
    students: `${API_BASE}/students`,
    courses: `${API_BASE}/courses`,
};

/* ── Función base de fetch ── */
async function apiFetch(url, options = {}) {
    const config = {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
    };

    const res = await fetch(url, config);
    const data = await res.json();

    if (!res.ok) {
        const msg = data.message || `Error ${res.status}`;
        throw Object.assign(new Error(msg), { status: res.status, data });
    }

    return data;
}

/* ── API de Estudiantes ── */
const StudentAPI = {
    getAll: () => apiFetch(API.students),
    getById: (id) => apiFetch(`${API.students}/${id}`),
    create: (body) =>
        apiFetch(API.students, { method: "POST", body: JSON.stringify(body) }),
    update: (id, b) =>
        apiFetch(`${API.students}/${id}`, {
            method: "PUT",
            body: JSON.stringify(b),
        }),
    delete: (id) => apiFetch(`${API.students}/${id}`, { method: "DELETE" }),
};

/* ── API de Cursos ── */
const CourseAPI = {
    getAll: () => apiFetch(API.courses),
    getById: (id) => apiFetch(`${API.courses}/${id}`),
    create: (body) =>
        apiFetch(API.courses, { method: "POST", body: JSON.stringify(body) }),
    update: (id, b) =>
        apiFetch(`${API.courses}/${id}`, {
            method: "PUT",
            body: JSON.stringify(b),
        }),
    delete: (id) => apiFetch(`${API.courses}/${id}`, { method: "DELETE" }),
};

/* ── Health checks (todo por el gateway, sin CORS issues) ── */
async function checkHealth() {
    const services = [
        {
            name: "API Gateway",
            url: "/health", //proxeado por Vite
            icon: "🌐",
            color: "#4f46e5",
        },
        {
            name: "Student Service",
            url: "/health/students", // proxeado por Vite
            icon: "🎓",
            color: "#059669",
        },
        {
            name: "Course Service",
            url: "/health/courses", // proxeado por Vite
            icon: "📚",
            color: "#d97706",
        },
    ];

    const container = document.getElementById("health-cards");
    if (!container) return;

    container.innerHTML = "";

    for (const svc of services) {
        try {
            const res = await fetch(svc.url, { signal: AbortSignal.timeout(4000) });
            const data = await res.json();
            container.innerHTML += buildHealthCard(svc, "UP", data.uptime || "—");
        } catch {
            container.innerHTML += buildHealthCard(svc, "DOWN", "—");
        }
    }
}

function buildHealthCard(svc, status, uptime) {
    const isUp = status === "UP";
    const label = isUp ? "Operativo" : "Sin conexión";

    return `
    <div class="col-md-4">
        <div class="health-card">
            <div class="health-icon"
                style="background:${svc.color}14;color:${svc.color};font-size:1.2rem"
                aria-hidden="true">${svc.icon}</div>
            <div>
            <p class="health-name">${svc.name}</p>
            <div class="health-status">
                <span class="health-dot ${isUp ? "up" : "down"}"
                    aria-label="${isUp ? "Activo" : "Inactivo"}"></span>
                ${label} · uptime ${uptime}
            </div>
            </div>
        </div>
    </div>`;
}

/* ── Toast notificaciones ── */
function showToast(type, title, message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const icons = {
        success: "bi-check-circle-fill",
        error: "bi-x-circle-fill",
        warning: "bi-exclamation-triangle-fill",
        info: "bi-info-circle-fill",
    };

    const id = `toast-${Date.now()}`;
    const html = `
    <div class="toast-pro type-${type}" id="${id}" role="alert">
        <i class="bi ${icons[type] || icons.info} toast-icon" aria-hidden="true"></i>
        <div>
            <div class="toast-title">${title}</div>
            <div class="toast-msg">${message}</div>
        </div>
    </div>`;

    container.insertAdjacentHTML("beforeend", html);

    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
            el.style.opacity = "0";
            el.style.transform = "translateX(110%)";
            el.style.transition = ".25s";
            setTimeout(() => el.remove(), 250);
        }
    }, 4000);
}

/* ── Utilidades compartidas ── */
function formatDate(isoStr) {
    if (!isoStr) return "—";
    return new Date(isoStr).toLocaleDateString("es-PE", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}

function getInitials(nombres = "", apellidos = "") {
    const n = nombres.trim().split(" ")[0]?.[0] || "";
    const a = apellidos.trim().split(" ")[0]?.[0] || "";
    return (n + a).toUpperCase();
}

function getCarreraBadge(carrera) {
    const map = {
        "Contabilidad": "cb-cont",
        "Medicina Humana": "cb-medicina",
        "Derecho": "cb-derecho",
        "Ingenieria de Sistemas": "cb-sistemas",
        "Ingenieria de Software": "cb-software",
        "Ingenieria Civil": "cb-civil",
        "Administracion de Empresas": "cb-admin",
    };
    const cls = map[carrera] || "cb-default";
    return `<span class="carrera-badge ${cls}">${carrera}</span>`;
}

function getCreditsBadge(creditos) {
    return `<span class="credits-badge" aria-label="${creditos} créditos">${creditos}</span>`;
}

// Animación de pulso para health indicators
const _style = document.createElement("style");
_style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: .3; }
  }
`;
document.head.appendChild(_style);

async function updateSidebarCounts() {
    try {
        const [students, courses] = await Promise.allSettled([
            StudentAPI.getAll(),
            CourseAPI.getAll(),
        ]);

        const sEl = document.getElementById("sb-student-count");
        const cEl = document.getElementById("sb-course-count");

        if (sEl && students.status === "fulfilled")
            sEl.textContent =
                students.value.count ?? students.value.data?.length ?? "—";
        if (cEl && courses.status === "fulfilled")
            cEl.textContent =
                courses.value.count ?? courses.value.data?.length ?? "—";
    } catch {
        /* silencioso */
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateSidebarCounts();
});
