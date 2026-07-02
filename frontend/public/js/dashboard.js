/* =============================================
   dashboard.js — Lógica del panel principal
   ============================================= */

let allStudents = [];
let allCourses = [];

/* ── Cargar todo el dashboard ── */
async function loadDashboard() {
  await Promise.allSettled([loadStudentStats(), loadCourseStats()]);
  await checkHealth();
}

/* ── Estadísticas de estudiantes ── */
async function loadStudentStats() {
  try {
    const res = await StudentAPI.getAll();
    allStudents = res.data || [];
    const count = allStudents.length;
    const careers = [...new Set(allStudents.map((s) => s.carrera))].length;

    animateNumber("total-students", count);
    animateNumber("total-careers", careers);

    renderRecentStudents(allStudents.slice(-5).reverse());
  } catch (err) {
    document.getElementById("total-students").textContent = "—";
    document.getElementById("total-careers").textContent = "—";
    showToast("error", "Error", "No se pudo conectar con el Student Service");
  }
}

/* ── Estadísticas de cursos ── */
async function loadCourseStats() {
  try {
    const res = await CourseAPI.getAll();
    allCourses = res.data || [];
    const count = allCourses.length;
    const avgCr = count
      ? (
        allCourses.reduce((s, c) => s + Number(c.creditos), 0) / count
      ).toFixed(1)
      : "0";

    animateNumber("total-courses", count);
    document.getElementById("avg-credits").textContent = avgCr;

    renderRecentCourses(allCourses.slice(-5).reverse());
  } catch (err) {
    document.getElementById("total-courses").textContent = "—";
    document.getElementById("avg-credits").textContent = "—";
    showToast("error", "Error", "No se pudo conectar con el Course Service");
  }
}

/* ── Animar contadores ── */
function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 700;
  const start = performance.now();

  requestAnimationFrame(function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  });
}

/* ── Tabla de estudiantes recientes ── */
function renderRecentStudents(students) {
  const tbody = document.getElementById("recent-students-table");
  if (!tbody) return;

  if (!students.length) {
    tbody.innerHTML = `<tr><td colspan="3">
      <div class="table-empty">
        <i class="bi bi-people" aria-hidden="true"></i>
        <h6>Sin estudiantes</h6>
        <p>Aún no hay estudiantes registrados.</p>
      </div></td></tr>`;
    return;
  }

  tbody.innerHTML = students.map(s => `
    <tr>
      <td>
        <div class="td-person">
          <div class="person-avatar" style="--avatar-bg:${getAvatarGradient(s.nombres + s.apellidos)}" aria-hidden="true">
            ${getInitials(s.nombres, s.apellidos)}
          </div>
          <div>
            <div class="person-name">${s.nombres} ${s.apellidos}</div>
            <div class="person-email">${s.correo}</div>
          </div>
        </div>
      </td>
      <td><span class="code-badge">${s.codigo}</span></td>
      <td>${getCarreraBadge(s.carrera)}</td>
    </tr>`).join("");
}

/* ── Tabla de cursos recientes ── */
function renderRecentCourses(courses) {
  const tbody = document.getElementById("recent-courses-table");
  if (!tbody) return;

  if (!courses.length) {
    tbody.innerHTML = `
      <tr><td colspan="3">
        <div class="empty-state">
          <i class="bi bi-journal-x"></i>
          <h6>Sin cursos</h6>
          <p>Aún no hay cursos registrados.</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = courses
    .map(
      (c) => `
    <tr class="fade-in">
      <td>
        <div style="font-weight:600;font-size:.85rem">${c.nombre}</div>
        <div style="font-size:.72rem;color:#94a3b8">${c.docente}</div>
      </td>
      <td><code style="font-size:.78rem;background:#f1f5f9;padding:3px 8px;border-radius:6px">${c.codigo}</code></td>
      <td>${getCreditsBadge(c.creditos)}</td>
    </tr>
  `,
    )
    .join("");
}

/* ── Refrescar dashboard ── */
async function refreshDashboard() {
  const btn = document.querySelector(".topbar-actions .btn");
  if (btn) {
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    btn.disabled = true;
  }

  await loadDashboard();

  if (btn) {
    btn.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
    btn.disabled = false;
  }

  showToast("success", "Actualizado", "Datos del dashboard actualizados");
}

/* ── Inicializar ── */
document.addEventListener("DOMContentLoaded", loadDashboard);
