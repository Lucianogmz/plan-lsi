import { useState, useEffect } from "react";

const MATERIAS = [
  { id: "101", codigo: "340101", nombre: "Sistemas y Organizaciones", anio: 1, cuatrimestre: "Anual", correlativas: [] },
  { id: "102", codigo: "340102", nombre: "Fundamentos de Programación", anio: 1, cuatrimestre: "Anual", correlativas: [] },
  { id: "103", codigo: "340103", nombre: "Cálculo Diferencial e Integral", anio: 1, cuatrimestre: "Anual", correlativas: [] },
  { id: "104", codigo: "340104", nombre: "Lógica y Álgebra", anio: 1, cuatrimestre: "Anual", correlativas: [] },
  { id: "105", codigo: "340105", nombre: "Lecto-Comprensión en Inglés", anio: 1, cuatrimestre: "Anual", correlativas: [] },
  { id: "106", codigo: "340106", nombre: "Derechos Humanos y Tecnología", anio: 1, cuatrimestre: "C1", correlativas: [] },
  { id: "107", codigo: "340107", nombre: "Fundamentos de Computación", anio: 1, cuatrimestre: "C2", correlativas: [] },
  { id: "208", codigo: "340208", nombre: "Ingeniería de Software I", anio: 2, cuatrimestre: "Anual", correlativas: ["101", "102"] },
  { id: "209", codigo: "340209", nombre: "Algoritmos y Estructura de Datos", anio: 2, cuatrimestre: "Anual", correlativas: ["102", "104"] },
  { id: "210", codigo: "340210", nombre: "Programación Orientada a Objetos", anio: 2, cuatrimestre: "Anual", correlativas: ["102", "105", "107"] },
  { id: "211", codigo: "340211", nombre: "Matemática Discreta", anio: 2, cuatrimestre: "Anual", correlativas: ["104"] },
  { id: "212", codigo: "340212", nombre: "Ecuaciones Diferenciales y Cálculo Multivariado", anio: 2, cuatrimestre: "C1", correlativas: ["103"] },
  { id: "213", codigo: "340213", nombre: "Arquitectura de Computadoras", anio: 2, cuatrimestre: "C2", correlativas: ["102", "107"] },
  { id: "299", codigo: "340299", nombre: "Optativa I", anio: 2, cuatrimestre: "C2", correlativas: ["102", "105", "107"] },
  { id: "314", codigo: "340314", nombre: "Ingeniería de Software II", anio: 3, cuatrimestre: "Anual", correlativas: ["208", "209", "210"] },
  { id: "315", codigo: "340315", nombre: "Bases de Datos", anio: 3, cuatrimestre: "Anual", correlativas: ["209", "210", "211"] },
  { id: "316", codigo: "340316", nombre: "Sistemas Operativos", anio: 3, cuatrimestre: "Anual", correlativas: ["209", "211", "213"] },
  { id: "317", codigo: "340317", nombre: "Probabilidad y Estadística", anio: 3, cuatrimestre: "Anual", correlativas: ["211", "212"] },
  { id: "318", codigo: "340318", nombre: "Paradigmas y Lenguajes", anio: 3, cuatrimestre: "C1", correlativas: ["209", "210", "213"] },
  { id: "319", codigo: "340319", nombre: "Ética Profesional", anio: 3, cuatrimestre: "C1", correlativas: ["106", "208"] },
  { id: "320", codigo: "340320", nombre: "Programación Avanzada", anio: 3, cuatrimestre: "C2", correlativas: ["209", "210"] },
  { id: "399", codigo: "340399", nombre: "Optativa II", anio: 3, cuatrimestre: "C1", correlativas: ["105", "208", "209", "210"] },
  { id: "321", codigo: "340321", nombre: "Taller de Integración", anio: 3, cuatrimestre: "C2", correlativas: ["209", "210", "211", "212", "213", "299"] },
  { id: "422", codigo: "340422", nombre: "Inteligencia Artificial", anio: 4, cuatrimestre: "Anual", correlativas: ["315", "317", "318"] },
  { id: "423", codigo: "340423", nombre: "Bases de Datos Avanzadas", anio: 4, cuatrimestre: "Anual", correlativas: ["315", "320"] },
  { id: "424", codigo: "340424", nombre: "Comunicaciones y Redes", anio: 4, cuatrimestre: "Anual", correlativas: ["316", "317"] },
  { id: "425", codigo: "340425", nombre: "Metodología de la Investigación", anio: 4, cuatrimestre: "Anual", correlativas: ["208", "317"] },
  { id: "426", codigo: "340426", nombre: "Investigación Operativa", anio: 4, cuatrimestre: "C1", correlativas: ["317"] },
  { id: "427", codigo: "340427", nombre: "Optativa III", anio: 4, cuatrimestre: "C1", correlativas: ["314", "315", "320", "321"] },
  { id: "428", codigo: "340428", nombre: "Computación Avanzada", anio: 4, cuatrimestre: "C2", correlativas: ["315", "316"] },
  { id: "429", codigo: "340429", nombre: "Optativa IV", anio: 4, cuatrimestre: "C2", correlativas: ["316", "318", "320"] },
  { id: "530", codigo: "340530", nombre: "Seguridad y Auditoría", anio: 5, cuatrimestre: "Anual", correlativas: ["319", "424"] },
  { id: "531", codigo: "340531", nombre: "Administración de Recursos", anio: 5, cuatrimestre: "Anual", correlativas: ["423", "424"] },
  { id: "532", codigo: "340532", nombre: "Teoría de Computabilidad", anio: 5, cuatrimestre: "Anual", correlativas: ["318", "423", "424"] },
  { id: "533", codigo: "340533", nombre: "Tesina de Grado", anio: 5, cuatrimestre: "Anual", correlativas: ["423", "424", "425"] },
  { id: "534", codigo: "340534", nombre: "Interfaz Hombre Máquina", anio: 5, cuatrimestre: "C1", correlativas: ["320", "428"] },
  { id: "535", codigo: "340535", nombre: "Optativa V", anio: 5, cuatrimestre: "C2", correlativas: ["423"] },
];

const s = { fontFamily: "'Space Mono', 'Courier New', monospace" };

export default function AdminPanel({ supabase, user, onLogout }) {
  const [tab, setTab] = useState("stats");
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { cargarUsuarios(); }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    const { data } = await supabase.from("user_estados").select("user_id, estados, updated_at");
    setUsuarios(data || []);
    setLoading(false);
  };

  // Calcular stats globales
  const totalUsuarios = usuarios.length;
  const promedioProgreso = totalUsuarios === 0 ? 0 : Math.round(
    usuarios.reduce((acc, u) => {
      const apr = Object.values(u.estados || {}).filter(e => e === "aprobada").length;
      return acc + (apr / MATERIAS.length) * 100;
    }, 0) / totalUsuarios
  );

  // Materia con más aprobados
  const conteoAprobadas = {};
  const conteoTrabados = {};
  MATERIAS.forEach(m => { conteoAprobadas[m.id] = 0; conteoTrabados[m.id] = 0; });
  usuarios.forEach(u => {
    MATERIAS.forEach(m => {
      if ((u.estados || {})[m.id] === "aprobada") conteoAprobadas[m.id]++;
      else conteoTrabados[m.id]++;
    });
  });

  const topAprobadas = [...MATERIAS].sort((a, b) => conteoAprobadas[b.id] - conteoAprobadas[a.id]).slice(0, 5);
  const topTrabadas = [...MATERIAS].sort((a, b) => conteoTrabados[b.id] - conteoTrabados[a.id]).slice(0, 5);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", ...s }}>
      {/* Header */}
      <div style={{
        background: "#0d0d1f", borderBottom: "1px solid #2a2a4a",
        padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#cc4466", marginBottom: "3px" }}>PANEL ADMIN · UADER FCyT</div>
          <h1 style={{ margin: 0, fontSize: "16px", color: "#eeeeff" }}>Licenciatura en Sistemas de Información</h1>
          <div style={{ fontSize: "10px", color: "#556", marginTop: "2px" }}>{user.email}</div>
        </div>
        <button onClick={onLogout} style={{
          padding: "6px 14px", background: "transparent", border: "1px solid #3a3a5c",
          color: "#556", borderRadius: "4px", cursor: "pointer", ...s, fontSize: "10px",
        }}>SALIR</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a2e", padding: "0 24px" }}>
        {[
          { key: "stats", label: "📊 Estadísticas" },
          { key: "usuarios", label: "👥 Usuarios" },
          { key: "plan", label: "📋 Plan de Estudios" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "12px 20px", background: "transparent",
            border: "none", borderBottom: tab === t.key ? "2px solid #cc4466" : "2px solid transparent",
            color: tab === t.key ? "#eeeeff" : "#556", cursor: "pointer", ...s, fontSize: "11px",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "24px" }}>
        {loading ? (
          <div style={{ color: "#4466cc", fontSize: "11px", letterSpacing: "3px" }}>CARGANDO...</div>
        ) : (
          <>
            {tab === "stats" && <TabStats
              totalUsuarios={totalUsuarios}
              promedioProgreso={promedioProgreso}
              topAprobadas={topAprobadas}
              topTrabadas={topTrabadas}
              conteoAprobadas={conteoAprobadas}
              conteoTrabados={conteoTrabados}
              totalUsuarios2={totalUsuarios}
            />}
            {tab === "usuarios" && <TabUsuarios usuarios={usuarios} />}
            {tab === "plan" && <TabPlan supabase={supabase} />}
          </>
        )}
      </div>
    </div>
  );
}

// ── TAB ESTADÍSTICAS ──────────────────────────────
function TabStats({ totalUsuarios, promedioProgreso, topAprobadas, topTrabadas, conteoAprobadas, conteoTrabados }) {
  return (
    <div>
      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "28px" }}>
        <StatCard label="Usuarios registrados" value={totalUsuarios} color="#4466cc" />
        <StatCard label="Progreso promedio" value={`${promedioProgreso}%`} color="#00ff88" />
        <StatCard label="Total materias" value={MATERIAS.length} color="#cc4466" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Top aprobadas */}
        <div style={{ background: "#0d0d1f", border: "1px solid #2a2a4a", borderRadius: "10px", padding: "20px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#00ff88", marginBottom: "14px" }}>TOP MATERIAS APROBADAS</div>
          {topAprobadas.map(m => (
            <div key={m.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", color: "#aaa" }}>{m.nombre}</span>
                <span style={{ fontSize: "11px", color: "#00ff88" }}>{conteoAprobadas[m.id]}</span>
              </div>
              <div style={{ height: "4px", background: "#1a1a2e", borderRadius: "2px" }}>
                <div style={{
                  height: "100%", borderRadius: "2px", background: "#00ff88",
                  width: totalUsuarios > 0 ? `${(conteoAprobadas[m.id] / totalUsuarios) * 100}%` : "0%",
                  transition: "width 0.4s ease",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Top trabadas */}
        <div style={{ background: "#0d0d1f", border: "1px solid #2a2a4a", borderRadius: "10px", padding: "20px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#cc4466", marginBottom: "14px" }}>MATERIAS CON MÁS PENDIENTES</div>
          {topTrabadas.map(m => (
            <div key={m.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", color: "#aaa" }}>{m.nombre}</span>
                <span style={{ fontSize: "11px", color: "#cc4466" }}>{conteoTrabados[m.id]}</span>
              </div>
              <div style={{ height: "4px", background: "#1a1a2e", borderRadius: "2px" }}>
                <div style={{
                  height: "100%", borderRadius: "2px", background: "#cc4466",
                  width: totalUsuarios > 0 ? `${(conteoTrabados[m.id] / totalUsuarios) * 100}%` : "0%",
                  transition: "width 0.4s ease",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TAB USUARIOS ──────────────────────────────────
function TabUsuarios({ usuarios }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#556", marginBottom: "16px" }}>
        {usuarios.length} USUARIOS REGISTRADOS
      </div>
      {usuarios.length === 0 && (
        <div style={{ color: "#556", fontSize: "12px" }}>Todavía no hay usuarios con datos guardados.</div>
      )}
      {usuarios.map((u, i) => {
        const apr = Object.values(u.estados || {}).filter(e => e === "aprobada").length;
        const reg = Object.values(u.estados || {}).filter(e => e === "regular").length;
        const prog = Math.round((apr / MATERIAS.length) * 100);
        const isExp = expanded === i;

        return (
          <div key={u.user_id} style={{
            background: "#0d0d1f", border: "1px solid #2a2a4a", borderRadius: "8px",
            marginBottom: "8px", overflow: "hidden",
          }}>
            <div
              onClick={() => setExpanded(isExp ? null : i)}
              style={{
                padding: "14px 18px", cursor: "pointer", display: "flex",
                justifyContent: "space-between", alignItems: "center", gap: "12px",
              }}
            >
              <div style={{ fontSize: "12px", color: "#aaa" }}>{u.user_id.slice(0, 8)}...</div>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "#00ff88" }}>{apr} apr.</span>
                <span style={{ fontSize: "11px", color: "#4a8a4a" }}>{reg} reg.</span>
                <div style={{ width: "80px", height: "4px", background: "#1a1a2e", borderRadius: "2px" }}>
                  <div style={{ height: "100%", width: `${prog}%`, background: "#00ff88", borderRadius: "2px" }} />
                </div>
                <span style={{ fontSize: "11px", color: "#4466cc", minWidth: "32px" }}>{prog}%</span>
                <span style={{ fontSize: "11px", color: "#333355" }}>{isExp ? "▲" : "▼"}</span>
              </div>
            </div>

            {isExp && (
              <div style={{ padding: "0 18px 16px", borderTop: "1px solid #1a1a2e" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "6px", marginTop: "12px" }}>
                  {MATERIAS.map(m => {
                    const e = (u.estados || {})[m.id] || "pendiente";
                    const color = e === "aprobada" ? "#00ff88" : e === "regular" ? "#4a8a4a" : "#2a2a4a";
                    return (
                      <div key={m.id} style={{
                        padding: "6px 10px", borderRadius: "5px",
                        border: `1px solid ${color}`,
                        display: "flex", justifyContent: "space-between",
                      }}>
                        <span style={{ fontSize: "10px", color: "#888" }}>{m.nombre}</span>
                        <span style={{ fontSize: "9px", color: color, textTransform: "uppercase" }}>
                          {e === "aprobada" ? "✓" : e === "regular" ? "R" : "·"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── TAB PLAN DE ESTUDIOS ──────────────────────────
function TabPlan({ supabase }) {
  const [materias, setMaterias] = useState(MATERIAS);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  const abrirEdicion = (m) => {
    setEditando(m.id);
    setForm({ ...m, correlativas: m.correlativas.join(", ") });
  };

  const guardar = () => {
    const updated = materias.map(m =>
      m.id === editando
        ? { ...form, correlativas: form.correlativas.split(",").map(s => s.trim()).filter(Boolean) }
        : m
    );
    setMaterias(updated);
    setEditando(null);
    setMsg("Cambios guardados localmente. Para persistir, actualizá el archivo MATERIAS en el código.");
    setTimeout(() => setMsg(""), 4000);
  };

  return (
    <div>
      {msg && (
        <div style={{ padding: "10px 16px", background: "#0a2a1a", border: "1px solid #00ff88", borderRadius: "6px", color: "#00ff88", fontSize: "11px", marginBottom: "16px" }}>
          {msg}
        </div>
      )}
      <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#556", marginBottom: "16px" }}>
        {materias.length} MATERIAS · Click para editar
      </div>
      {[1,2,3,4,5].map(anio => (
        <div key={anio} style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "9px", color: "#3a3a6a", letterSpacing: "3px", marginBottom: "8px" }}>── {anio}° AÑO</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "6px" }}>
            {materias.filter(m => m.anio === anio).map(m => (
              <div key={m.id}>
                {editando === m.id ? (
                  <div style={{ background: "#111128", border: "1px solid #4466cc", borderRadius: "8px", padding: "12px" }}>
                    <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                      style={{ width: "100%", background: "#1a1a2e", border: "1px solid #3a3a5c", borderRadius: "4px", color: "#ccc", padding: "6px 8px", fontSize: "11px", marginBottom: "6px", boxSizing: "border-box", fontFamily: "inherit" }} />
                    <input value={form.correlativas} onChange={e => setForm({...form, correlativas: e.target.value})}
                      placeholder="IDs separados por coma (ej: 101, 102)"
                      style={{ width: "100%", background: "#1a1a2e", border: "1px solid #3a3a5c", borderRadius: "4px", color: "#ccc", padding: "6px 8px", fontSize: "10px", marginBottom: "8px", boxSizing: "border-box", fontFamily: "inherit" }} />
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={guardar} style={{ flex: 1, padding: "5px", background: "#004422", border: "1px solid #00ff88", borderRadius: "4px", color: "#00ff88", cursor: "pointer", fontSize: "10px", fontFamily: "inherit" }}>GUARDAR</button>
                      <button onClick={() => setEditando(null)} style={{ flex: 1, padding: "5px", background: "transparent", border: "1px solid #3a3a5c", borderRadius: "4px", color: "#556", cursor: "pointer", fontSize: "10px", fontFamily: "inherit" }}>CANCELAR</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => abrirEdicion(m)} style={{
                    padding: "10px 13px", borderRadius: "8px", background: "#0d0d1f",
                    border: "1px solid #2a2a4a", cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#4466cc"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a4a"}
                  >
                    <div style={{ fontSize: "12px", color: "#ccc", marginBottom: "4px" }}>{m.nombre}</div>
                    <div style={{ fontSize: "9px", color: "#3a3a6a" }}>
                      {m.codigo} · {m.cuatrimestre}
                      {m.correlativas.length > 0 && ` · ${m.correlativas.length} correl.`}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "#0d0d1f", border: `1px solid ${color}22`, borderRadius: "10px", padding: "20px" }}>
      <div style={{ fontSize: "28px", fontWeight: "700", color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "10px", color: "#556", marginTop: "6px" }}>{label}</div>
    </div>
  );
}