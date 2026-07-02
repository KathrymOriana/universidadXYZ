/* =============================================
   students.js — CRUD completo de estudiantes
   ============================================= */

let allStudents = [];
let deleteTargetId = null;

const studentModal = () =>
    new bootstrap.Modal(document.getElementById("studentModal"));
const deleteModal = () =>
    new bootstrap.Modal(document.getElementById("deleteModal"));
const viewModal = () =>
    new bootstrap.Modal(document.getElementById("viewModal"));

async function loadStudents() {
    const tbody = document.getElementById("students-table-body");
    tbody.innerHTML = `
    <tr>
        <td colspan="6" class="table-loading">
            <span class="spinner-border spinner-border-sm me-2"></span>Cargando estudiantes...
        </td>
    </tr>`;

    try {
        const res = await StudentAPI.getAll();
        allStudents = res.data || [];
        renderStudents(allStudents);
        updateSidebarCounts();
    } catch (err) {
        tbody.innerHTML = `
        <tr>
            <td colspan="6">
                <div class="table-empty">
                    <i class="bi bi-wifi-off" aria-hidden="true"></i>
                    <h6>Sin conexión</h6>
                    <p>No se pudo conectar al servidor. Verifica que el backend esté corriendo.</p>
                </div>
            </td>
        </tr>`;
        showToast("error", "Error de conexión", err.message);
    }
}

function renderStudents(students) {
    const tbody = document.getElementById("students-table-body");
    const pill = document.getElementById("student-count-pill");

    if (!students.length) {
        tbody.innerHTML = 
        `<tr>
            <td colspan="6">
                <div class="table-empty">
                    <i class="bi bi-person-slash" aria-hidden="true"></i>
                    <h6>Sin resultados</h6>
                    <p>No se encontraron estudiantes con ese criterio.</p>
                </div>
            </td>
        </tr>`;
        if (pill) pill.textContent = 0;
        return;
    }

    tbody.innerHTML = students.map(
        (s, i) => `
            <tr style="animation:fade-up .25s ease both;animation-delay:${i * 0.03}s">
                <td style="color:#94a3b8;font-size:.75rem;font-weight:700">${i + 1}</td>
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
                <td><span class="date-text">${formatDate(s.created_at)}</span></td>
                <td>
                    <div class="td-actions" role="group" aria-label="Acciones para ${s.nombres}">
                    <button class="action-btn view" onclick="viewStudent(${s.id})" title="Ver detalle" aria-label="Ver detalle">
                        <i class="bi bi-eye-fill" aria-hidden="true"></i>
                    </button>
                    <button class="action-btn edit" onclick="editStudent(${s.id})" title="Editar" aria-label="Editar">
                        <i class="bi bi-pencil-fill" aria-hidden="true"></i>
                    </button>
                    <button class="action-btn remove"
                            onclick="deleteStudent(${s.id}, '${(s.nombres + " " + s.apellidos).replace(/'/g, "\\'")}')"
                            title="Eliminar" aria-label="Eliminar">
                        <i class="bi bi-trash3-fill" aria-hidden="true"></i>
                    </button>
                    </div>
                </td>
            </tr>`,
        )
        .join("");

    if (pill) pill.textContent = students.length;
}

function filterStudents(query) {
    const q = query.toLowerCase();
    const filtered = q
        ? allStudents.filter(
            (s) =>
                s.nombres.toLowerCase().includes(q) ||
                s.apellidos.toLowerCase().includes(q) ||
                s.codigo.toLowerCase().includes(q) ||
                s.correo.toLowerCase().includes(q) ||
                s.carrera.toLowerCase().includes(q),
        )
        : allStudents;
    renderStudents(filtered);
}

function openCreateModal() {
    clearForm();
    document.getElementById("modal-title").textContent = "Nuevo Estudiante";
    document.getElementById("student-id").value = "";
    studentModal().show();
}

function editStudent(id) {
    const s = allStudents.find((s) => s.id === id);
    if (!s) return;

    document.getElementById("modal-title").textContent = "Editar Estudiante";
    document.getElementById("student-id").value = s.id;
    document.getElementById("f-codigo").value = s.codigo;
    document.getElementById("f-nombres").value = s.nombres;
    document.getElementById("f-apellidos").value = s.apellidos;
    document.getElementById("f-correo").value = s.correo;
    document.getElementById("f-carrera").value = s.carrera;

    clearErrors();
    studentModal().show();
}

function viewStudent(id) {
    const s = allStudents.find((s) => s.id === id);
    if (!s) return;

    document.getElementById("view-modal-body").innerHTML = `
        <div class="detail-header">
        <div class="detail-avatar-lg" style="--avatar-bg:${getAvatarGradient(s.nombres + s.apellidos)}" aria-hidden="true">
            ${getInitials(s.nombres, s.apellidos)}
        </div>
        <p class="detail-name">${s.nombres} ${s.apellidos}</p>
        <p class="detail-sub">${s.correo}</p>
        </div>
        <div class="detail-grid">
        <div class="detail-cell">
            <p class="detail-cell-label">Código</p>
            <p class="detail-cell-value"><span class="code-badge">${s.codigo}</span></p>
        </div>
        <div class="detail-cell">
            <p class="detail-cell-label">ID Sistema</p>
            <p class="detail-cell-value">#${s.id}</p>
        </div>
        <div class="detail-cell full">
            <p class="detail-cell-label">Carrera</p>
            <p class="detail-cell-value">${getCarreraBadge(s.carrera)}</p>
        </div>
        <div class="detail-cell">
            <p class="detail-cell-label">Fecha de registro</p>
            <p class="detail-cell-value">${formatDate(s.created_at)}</p>
        </div>
        <div class="detail-cell">
            <p class="detail-cell-label">Última actualización</p>
            <p class="detail-cell-value">${formatDate(s.updated_at)}</p>
        </div>
        </div>`;

    viewModal().show();
}

async function saveStudent() {
    if (!validateForm()) return;

    const id = document.getElementById("student-id").value;
    const body = {
        codigo: document.getElementById("f-codigo").value.trim().toUpperCase(),
        nombres: document.getElementById("f-nombres").value.trim(),
        apellidos: document.getElementById("f-apellidos").value.trim(),
        correo: document.getElementById("f-correo").value.trim().toLowerCase(),
        carrera: document.getElementById("f-carrera").value,
    };

    const btn = document.getElementById("save-btn");
    btn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-1"></span> Guardando...';
    btn.disabled = true;

    try {
        if (id) {
            await StudentAPI.update(id, body);
            showToast(
                "success",
                "Actualizado",
                `${body.nombres} fue actualizado correctamente`,
            );
        } else {
            await StudentAPI.create(body);
            showToast(
                "success",
                "Registrado",
                `${body.nombres} fue registrado correctamente`,
            );
        }
        bootstrap.Modal.getInstance(document.getElementById("studentModal")).hide();
        await loadStudents();
    } catch (err) {
        showToast("error", "Error", err.message);
    } finally {
        btn.innerHTML =
            '<i class="bi bi-check-circle-fill"></i> Guardar Estudiante';
        btn.disabled = false;
    }
}

function deleteStudent(id, name) {
    deleteTargetId = id;
    document.getElementById("delete-student-name").textContent = name;
    deleteModal().show();
}

async function confirmDelete() {
    if (!deleteTargetId) return;

    const btn = document.getElementById("confirm-delete-btn");
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    btn.disabled = true;

    try {
        await StudentAPI.delete(deleteTargetId);
        bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
        showToast("success", "Eliminado", "Estudiante eliminado correctamente");
        await loadStudents();
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
        { id: "f-nombres", err: "err-nombres", msg: "El nombre es obligatorio" },
        {
            id: "f-apellidos",
            err: "err-apellidos",
            msg: "Los apellidos son obligatorios",
        },
        { id: "f-correo", err: "err-correo", msg: "El correo es obligatorio" },
        { id: "f-carrera", err: "err-carrera", msg: "La carrera es obligatoria" },
    ];

    fields.forEach((f) => {
        const el = document.getElementById(f.id);
        const err = document.getElementById(f.err);
        if (!el.value.trim()) {
            err.textContent = f.msg;
            err.classList.add("visible");
            el.classList.add("has-error");
            valid = false;
        }
    });

    const correoEl = document.getElementById("f-correo");
    const correoErr = document.getElementById("err-correo");
    if (correoEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoEl.value)) {
        correoErr.textContent = "Formato de correo inválido";
        correoErr.classList.add("visible");
        correoEl.classList.add("has-error");
        valid = false;
    }
    return valid;
}

function clearErrors() {
    ["codigo", "nombres", "apellidos", "correo", "carrera"].forEach((f) => {
        const err = document.getElementById(`err-${f}`);
        const inp = document.getElementById(`f-${f}`);
        if (err) {
            err.textContent = "";
            err.classList.remove("visible");
        }
        if (inp) inp.classList.remove("has-error");
    });
}

function clearForm() {
    ["f-codigo", "f-nombres", "f-apellidos", "f-correo", "f-carrera"].forEach(
        (id) => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        },
    );
    clearErrors();
}

document.addEventListener("DOMContentLoaded", loadStudents);
