/* =============================================
   courses.js — CRUD completo de cursos
   ============================================= */

let allCourses = [];
let deleteTargetId = null;

const courseModal = () => new bootstrap.Modal(document.getElementById("courseModal"));
const deleteModal = () => new bootstrap.Modal(document.getElementById("deleteModal"));
const viewModal = () => new bootstrap.Modal(document.getElementById("viewModal"));

async function loadCourses() {
    const tbody = document.getElementById("courses-table-body");
    tbody.innerHTML = `<tr><td colspan="7" class="table-loading">
    <span class="spinner-border spinner-border-sm me-2"></span>Cargando cursos...
  </td></tr>`;

    try {
        const res = await CourseAPI.getAll();
        allCourses = res.data || [];
        renderCourses(allCourses);
        updateSidebarCounts();
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7">
      <div class="table-empty">
        <i class="bi bi-wifi-off" aria-hidden="true"></i>
        <h6>Sin conexión</h6>
        <p>No se pudo conectar al servidor. Verifica que el backend esté corriendo.</p>
      </div></td></tr>`;
        showToast("error", "Error de conexión", err.message);
    }
}

function renderCourses(courses) {
    const tbody = document.getElementById("courses-table-body");
    const pill = document.getElementById("course-count-pill");

    if (!courses.length) {
        tbody.innerHTML = `<tr><td colspan="7">
      <div class="table-empty">
        <i class="bi bi-journal-x" aria-hidden="true"></i>
        <h6>Sin resultados</h6>
        <p>No se encontraron cursos con ese criterio.</p>
      </div></td></tr>`;
        if (pill) pill.textContent = 0;
        return;
    }

    tbody.innerHTML = courses.map((c, i) => `
    <tr style="animation:fade-up .25s ease both;animation-delay:${i * 0.03}s">
      <td style="color:#94a3b8;font-size:.75rem;font-weight:700">${i + 1}</td>
      <td><div class="person-name" style="font-size:.845rem">${c.nombre}</div></td>
      <td><span class="code-badge">${c.codigo}</span></td>
      <td style="font-size:.82rem;color:#475569;max-width:180px">
        <span title="${c.docente}">${c.docente}</span>
      </td>
      <td style="text-align:center">${getCreditsBadge(c.creditos)}</td>
      <td><span class="date-text">${formatDate(c.created_at)}</span></td>
      <td>
        <div class="td-actions" role="group" aria-label="Acciones para ${c.nombre}">
          <button class="action-btn view" onclick="viewCourse(${c.id})" title="Ver detalle" aria-label="Ver detalle">
            <i class="bi bi-eye-fill" aria-hidden="true"></i>
          </button>
          <button class="action-btn edit" onclick="editCourse(${c.id})" title="Editar" aria-label="Editar">
            <i class="bi bi-pencil-fill" aria-hidden="true"></i>
          </button>
          <button class="action-btn remove"
                  onclick="deleteCourse(${c.id}, '${c.nombre.replace(/'/g, "\\'")}')"
                  title="Eliminar" aria-label="Eliminar">
            <i class="bi bi-trash3-fill" aria-hidden="true"></i>
          </button>
        </div>
      </td>
    </tr>`).join("");

    if (pill) pill.textContent = courses.length;
}

function filterCourses(query) {
    const q = query.toLowerCase();
    const filtered = q
        ? allCourses.filter(c =>
            c.nombre.toLowerCase().includes(q) ||
            c.codigo.toLowerCase().includes(q) ||
            c.docente.toLowerCase().includes(q) ||
            String(c.creditos).includes(q))
        : allCourses;
    renderCourses(filtered);
}

function openCreateModal() {
    clearForm();
    document.getElementById("modal-title").textContent = "Nuevo Curso";
    document.getElementById("course-id").value = "";
    courseModal().show();
}

function editCourse(id) {
    const c = allCourses.find(c => c.id === id);
    if (!c) return;

    document.getElementById("modal-title").textContent = "Editar Curso";
    document.getElementById("course-id").value = c.id;
    document.getElementById("f-codigo").value = c.codigo;
    document.getElementById("f-nombre").value = c.nombre;
    document.getElementById("f-creditos").value = c.creditos;
    document.getElementById("f-docente").value = c.docente;

    clearErrors();
    courseModal().show();
}

function viewCourse(id) {
    const c = allCourses.find(c => c.id === id);
    if (!c) return;

    const pct = Math.round((c.creditos / 10) * 100);
    const colors = ["", "#dc2626", "#f97316", "#f97316", "#eab308", "#eab308", "#84cc16", "#22c55e", "#22c55e", "#10b981", "#10b981"];

    document.getElementById("view-modal-body").innerHTML = `
    <div class="detail-header">
      <div class="detail-avatar-lg" style="--avatar-bg:${getAvatarGradient(c.nombre)};border-radius:16px;font-size:1.6rem" aria-hidden="true">📚</div>
      <p class="detail-name">${c.nombre}</p>
      <p class="detail-sub">${c.docente}</p>
    </div>
    <div class="detail-grid">
      <div class="detail-cell">
        <p class="detail-cell-label">Código</p>
        <p class="detail-cell-value"><span class="code-badge">${c.codigo}</span></p>
      </div>
      <div class="detail-cell">
        <p class="detail-cell-label">ID Sistema</p>
        <p class="detail-cell-value">#${c.id}</p>
      </div>
      <div class="detail-cell full">
        <p class="detail-cell-label">Créditos — ${c.creditos} de 10</p>
        <div style="height:7px;background:#e2e8f0;border-radius:4px;margin-top:6px;overflow:hidden">
          <div style="width:${pct}%;height:100%;background:${colors[c.creditos]};border-radius:4px"></div>
        </div>
      </div>
      <div class="detail-cell">
        <p class="detail-cell-label">Fecha de registro</p>
        <p class="detail-cell-value">${formatDate(c.created_at)}</p>
      </div>
      <div class="detail-cell">
        <p class="detail-cell-label">Última actualización</p>
        <p class="detail-cell-value">${formatDate(c.updated_at)}</p>
      </div>
    </div>`;

    viewModal().show();
}

async function saveCourse() {
    if (!validateForm()) return;

    const id = document.getElementById("course-id").value;
    const body = {
        codigo: document.getElementById("f-codigo").value.trim().toUpperCase(),
        nombre: document.getElementById("f-nombre").value.trim(),
        creditos: parseInt(document.getElementById("f-creditos").value),
        docente: document.getElementById("f-docente").value.trim(),
    };

    const btn = document.getElementById("save-btn");
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Guardando...';
    btn.disabled = true;

    try {
        if (id) {
            await CourseAPI.update(id, body);
            showToast("success", "Actualizado", `"${body.nombre}" fue actualizado correctamente`);
        } else {
            await CourseAPI.create(body);
            showToast("success", "Registrado", `"${body.nombre}" fue registrado correctamente`);
        }
        bootstrap.Modal.getInstance(document.getElementById("courseModal")).hide();
        await loadCourses();
    } catch (err) {
        showToast("error", "Error", err.message);
    } finally {
        btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Guardar Curso';
        btn.disabled = false;
    }
}

function deleteCourse(id, name) {
    deleteTargetId = id;
    document.getElementById("delete-course-name").textContent = name;
    deleteModal().show();
}

async function confirmDelete() {
    if (!deleteTargetId) return;

    const btn = document.getElementById("confirm-delete-btn");
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    btn.disabled = true;

    try {
        await CourseAPI.delete(deleteTargetId);
        bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
        showToast("success", "Eliminado", "Curso eliminado correctamente");
        await loadCourses();
    } catch (err) {
        showToast("error", "Error", err.message);
    } finally {
        btn.innerHTML = '<i class="bi bi-trash3 me-1"></i> Eliminar';
        btn.disabled = false;
        deleteTargetId = null;
    }
}

function validateForm() {
    clearErrors();
    let valid = true;

    const fields = [
        { id: "f-codigo", err: "err-codigo", msg: "El código es obligatorio" },
        { id: "f-nombre", err: "err-nombre", msg: "El nombre es obligatorio" },
        { id: "f-creditos", err: "err-creditos", msg: "Los créditos son obligatorios" },
        { id: "f-docente", err: "err-docente", msg: "El docente es obligatorio" },
    ];

    fields.forEach(f => {
        const el = document.getElementById(f.id);
        const err = document.getElementById(f.err);
        if (!el.value.toString().trim()) {
            err.textContent = f.msg; err.classList.add("visible");
            el.classList.add("has-error"); valid = false;
        }
    });

    const cr = parseInt(document.getElementById("f-creditos").value);
    const cErr = document.getElementById("err-creditos");
    if (!isNaN(cr) && (cr < 1 || cr > 10)) {
        cErr.textContent = "Los créditos deben estar entre 1 y 10";
        cErr.classList.add("visible");
        valid = false;
    }
    return valid;
}

function clearErrors() {
    ["codigo", "nombre", "creditos", "docente"].forEach(f => {
        const err = document.getElementById(`err-${f}`);
        const inp = document.getElementById(`f-${f}`);
        if (err) { err.textContent = ""; err.classList.remove("visible"); }
        if (inp) inp.classList.remove("has-error");
    });
}

function clearForm() {
    ["f-codigo", "f-nombre", "f-creditos", "f-docente"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    clearErrors();
}

document.addEventListener("DOMContentLoaded", loadCourses);