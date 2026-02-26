import { useState, useCallback, useEffect } from "react";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ztzqjwvokdiitrujhhqk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0enFqd3Zva2RpaXRydWpoaHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDc4NjQsImV4cCI6MjA4NzUyMzg2NH0.Gc2priBj2O_9C9iei8AqsogEDa734T8u5REylYOT37A";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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


const ESTADOS = { pendiente: "pendiente", regular: "regular", aprobada: "aprobada" };
const ANIOS = [1, 2, 3, 4, 5];
const ANIO_LABELS = ["1° Año", "2° Año", "3° Año", "4° Año", "5° Año"];

const COLORES = {
  pendiente:   { bg: "#1a1a2e", border: "#3a3a5c", text: "#8888aa", badge: "#2a2a4e" },
  regular:     { bg: "#2d2a15", border: "#b89b25", text: "#ffcc00", badge: "#544614" }, 
  aprobada:    { bg: "#0a2a1a", border: "#00ff88", text: "#00ff88", badge: "#004422" },
  puedeCursar: { bg: "#111133", border: "#4488ff", text: "#88aaff", badge: "#111133" },
  noPuede:     { bg: "#1a1a2e", border: "#2a2a4a", text: "#444466", badge: "#1a1a2e" },
};

function puedeSerCursada(mat, estados) {
  if (mat.correlativas.length === 0) return true;
  return mat.correlativas.every(c => estados[c] === "regular" || estados[c] === "aprobada");
}

function getEstadoVisual(mat, estados) {
  const e = estados[mat.id];
  if (e === "aprobada") return "aprobada";
  if (e === "regular") return "regular";
  if (puedeSerCursada(mat, estados)) return "puedeCursar";
  return "noPuede";
}

// ──────────────────────────────────────────────
// Pantalla de Login
// ──────────────────────────────────────────────
function LoginScreen({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modo, setModo] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handle = async () => {
    setLoading(true);
    setError("");
    setMensaje("");
    try {
      if (modo === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMensaje("¡Cuenta creada! Revisá tu email para confirmar.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth(data.user);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a14", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, sans-serif",
    }}>
      <div style={{
        width: "360px", padding: "40px",
        background: "#0d0d1f", border: "1px solid #2a2a4a",
        borderRadius: "12px",
      }}>
        <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#4466cc", marginBottom: "8px" }}>UADER · FCyT</div>
        <h2 style={{ color: "#eeeeff", margin: "0 0 8px", fontSize: "18px" }}>Plan de Estudios</h2>
        <p style={{ color: "#556", fontSize: "11px", margin: "0 0 28px" }}>Licenciatura en Sistemas de Información</p>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "10px", color: "#4466cc", letterSpacing: "2px", display: "block", marginBottom: "6px" }}>EMAIL</label>
          <input
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={{
              width: "100%", padding: "10px 12px", background: "#1a1a2e",
              border: "1px solid #3a3a5c", borderRadius: "6px", color: "#ccc",
              fontFamily: "inherit", fontSize: "12px", boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontSize: "10px", color: "#4466cc", letterSpacing: "2px", display: "block", marginBottom: "6px" }}>CONTRASEÑA</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="mínimo 6 caracteres"
            onKeyDown={e => e.key === "Enter" && handle()}
            style={{
              width: "100%", padding: "10px 12px", background: "#1a1a2e",
              border: "1px solid #3a3a5c", borderRadius: "6px", color: "#ccc",
              fontFamily: "inherit", fontSize: "12px", boxSizing: "border-box",
            }}
          />
        </div>

        {error && <div style={{ fontSize: "11px", color: "#ff6666", marginBottom: "16px", padding: "8px", background: "#2a1a1a", borderRadius: "4px" }}>{error}</div>}
        {mensaje && <div style={{ fontSize: "11px", color: "#00ff88", marginBottom: "16px", padding: "8px", background: "#0a2a1a", borderRadius: "4px" }}>{mensaje}</div>}

        <button onClick={handle} disabled={loading} style={{
          width: "100%", padding: "12px", background: loading ? "#2a2a4a" : "#2233aa",
          border: "none", borderRadius: "6px", color: "#eeeeff",
          fontFamily: "inherit", fontSize: "12px", cursor: loading ? "default" : "pointer",
          letterSpacing: "1px", fontWeight: "700",
        }}>
          {loading ? "..." : modo === "login" ? "INGRESAR" : "CREAR CUENTA"}
        </button>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <span
            onClick={() => { setModo(modo === "login" ? "register" : "login"); setError(""); setMensaje(""); }}
            style={{ fontSize: "11px", color: "#4466cc", cursor: "pointer", textDecoration: "underline" }}
          >
            {modo === "login" ? "¿No tenés cuenta? Registrate" : "¿Ya tenés cuenta? Ingresá"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// App principal
// ──────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estados, setEstados] = useState({});
  const [saving, setSaving] = useState(false);
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState(false);

  // Verificar sesión al arrancar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        cargarEstados(session.user.id);
      } else {
        setLoading(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else setUser(null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const cargarEstados = async (uid) => {
    const { data, error } = await supabase
      .from("user_estados")
      .select("estados")
      .eq("user_id", uid)
      .single();
    if (data?.estados) setEstados(data.estados);
    setLoading(false);
  };

  const guardarEstados = async (nuevosEstados) => {
    if (!user) return;
    setSaving(true);
    await supabase.from("user_estados").upsert({
      user_id: user.id,
      estados: nuevosEstados,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    setSaving(false);
  };

  const ciclarEstado = useCallback((id) => {
    setEstados(prev => {
      const actual = prev[id] || "pendiente";
      const siguiente = actual === "pendiente" ? "regular" : actual === "regular" ? "aprobada" : "pendiente";
      const nuevo = { ...prev, [id]: siguiente };
      guardarEstados(nuevo);
      return nuevo;
    });
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEstados({});
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", color: "#4466cc", fontSize: "12px", letterSpacing: "3px" }}>
      CARGANDO...
    </div>
  );

  if (!user) return <LoginScreen onAuth={(u) => { setUser(u); cargarEstados(u.id); }} />;

  const aprobadas = Object.values(estados).filter(e => e === "aprobada").length;
  const regulares = Object.values(estados).filter(e => e === "regular").length;
  const total = MATERIAS.length;
  const progreso = Math.round((aprobadas / total) * 100);

  const hoveredMat = MATERIAS.find(m => m.id === hover);
  const selectedMat = MATERIAS.find(m => m.id === selected);
  const focusMat = selectedMat || hoveredMat;
  const highlighted = focusMat ? new Set([focusMat.id, ...focusMat.correlativas]) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, sans-serif", color: "#ccc" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0d0d1f 0%, #111128 100%)",
        borderBottom: "1px solid #2a2a4a",
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
      }}>
        <div>
          <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#4466cc", marginBottom: "3px" }}>UADER · FCyT</div>
          <h1 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#eeeeff" }}>Licenciatura en Sistemas de Información</h1>
          <div style={{ fontSize: "10px", color: "#556", marginTop: "2px" }}>
            {user.email} {saving && <span style={{ color: "#4466cc" }}>· guardando...</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Stat label="Aprobadas" value={aprobadas} color="#00ff88" />
          <Stat label="Regulares" value={regulares} color="#ffcc00" />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "26px", fontWeight: "700", color: "#4466cc", lineHeight: 1 }}>{progreso}%</div>
            <div style={{ fontSize: "9px", color: "#556", marginTop: "2px" }}>completado</div>
          </div>
          <button onClick={logout} style={{
            padding: "6px 14px", background: "transparent", border: "1px solid #3a3a5c",
            color: "#556", borderRadius: "4px", cursor: "pointer", fontFamily: "inherit", fontSize: "10px",
          }}>SALIR</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "16px 24px", display: "flex", gap: "24px", borderBottom: "1px solid #1a1a2e", flexWrap: "wrap", alignItems: "center" }}>
        <LegendItem color="#3a3a5c" label="Pendiente" />
        <LegendItem color="#00ff88" label="Aprobada" />
        <LegendItem color="#ffcc00" label="Regular" />
        <LegendItem color="#4488ff" label="Puede cursar" />
        {/* BOTÓN DE FILTRO */}
        <button 
          onClick={() => setFiltroActivo(!filtroActivo)}
          style={{
            marginLeft: "auto", padding: "6px 12px", borderRadius: "6px",
            background: filtroActivo ? "#4488ff" : "transparent",
            color: filtroActivo ? "#ffffff" : "#88aaff",
            border: "1px solid #4488ff", cursor: "pointer",
            fontSize: "10px", fontWeight: "700", letterSpacing: "1px",
            transition: "all 0.2s ease"
          }}
        >
          {filtroActivo ? "MOSTRANDO: QUÉ PUEDO CURSAR ✕" : "FILTRAR: QUÉ PUEDO CURSAR"}
        </button>
      </div>

      {/* Info correlativas - Contenedor con altura fija para evitar Layout Shift */}
      <div style={{ 
        minHeight: "62px", 
        margin: "10px 24px",
      }}>
        {focusMat && (
          <div style={{
            padding: "10px 18px",
            background: "#111128", border: "1px solid #2a2a5a", borderRadius: "8px",
            display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap",
            animation: "fadeIn 0.2s ease-in-out" 
          }}>
            <div>
              <span style={{ fontSize: "9px", color: "#4466cc", letterSpacing: "2px" }}>CORRELATIVAS DE </span>
              <span style={{ fontSize: "13px", color: "#eeeeff", fontWeight: "700" }}>{focusMat.nombre}</span>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {focusMat.correlativas.length === 0
                ? <span style={{ fontSize: "11px", color: "#556" }}>Sin correlativas — libre</span>
                : focusMat.correlativas.map(cid => {
                    const m = MATERIAS.find(x => x.id === cid);
                    const e = estados[cid] || "pendiente";
                    return (
                      <span key={cid} style={{
                        fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                        border: `1px solid ${e === "aprobada" ? "#00ff88" : e === "regular" ? "#ffcc00" : "#3a3a5c"}`,
                        color: e === "aprobada" ? "#00ff88" : e === "regular" ? "#ffcc00" : "#556",
                      }}>{m?.nombre}</span>
                    );
                  })}
            </div>
            {selected && (
              <button onClick={() => setSelected(null)} style={{
                marginLeft: "auto", fontSize: "10px", padding: "3px 10px",
                background: "transparent", border: "1px solid #3a3a5c", color: "#556",
                borderRadius: "4px", cursor: "pointer",
              }}>✕</button>
            )}
          </div>
        )}
      </div>

      {/* Materias por año */}
      <div style={{ padding: "12px 24px 24px" }}>
        {ANIOS.map((anio, ai) => {
          // 1. Obtenemos todas las materias del año
          const materiasDelAnio = MATERIAS.filter(m => m.anio === anio);
          
          // 2. Aplicamos el filtro si está activo
          const materiasAMostrar = filtroActivo 
            ? materiasDelAnio.filter(mat => getEstadoVisual(mat, estados) === "puedeCursar")
            : materiasDelAnio;

          // 3. Si el filtro está activo y no hay materias en este año, no dibujamos el bloque del año
          if (filtroActivo && materiasAMostrar.length === 0) return null;

          return (
            <div key={anio} style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#3a3a6a", marginBottom: "6px", textTransform: "uppercase" }}>
                ── {ANIO_LABELS[ai]}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px" }}>
                {materiasAMostrar.map(mat => {
                  const ev = getEstadoVisual(mat, estados);
                  const col = COLORES[ev];
                  const isHighlighted = highlighted ? highlighted.has(mat.id) : true;
                  const isSelected = selected === mat.id;
                  const est = estados[mat.id] || "pendiente";

                  return (
                    <div
                      key={mat.id}
                      onClick={() => ciclarEstado(mat.id)}
                      onMouseEnter={() => setHover(mat.id)}
                      onMouseLeave={() => setHover(null)}
                      onContextMenu={e => { e.preventDefault(); setSelected(mat.id === selected ? null : mat.id); }}
                      style={{
                        padding: "10px 13px", borderRadius: "8px",
                        background: col.bg,
                        border: `1px solid ${isSelected ? "#ffffff33" : col.border}`,
                        cursor: "pointer",
                        opacity: isHighlighted ? 1 : 0.2,
                        transition: "opacity 0.2s ease-out, box-shadow 0.2s ease, border-color 0.2s ease",
                        willChange: "opacity",
                        outline: isSelected ? "2px solid #4466cc" : "none",
                        outlineOffset: "2px",
                        transform: "none",
                        boxShadow: hover === mat.id ? `0 0 15px ${col.border}66` : "none",
                        pointerEvents: "auto",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                        <div style={{ fontSize: "14px", color: col.text, fontWeight: "600", lineHeight: "1.4" }}>
                          {mat.nombre}
                        </div>
                         <div style={{
                          fontSize: "9px", padding: "4px 6px", borderRadius: "4px", fontWeight: "700",
                          background: col.badge, color: col.text,
                          whiteSpace: "nowrap", textTransform: "uppercase", flexShrink: 0,
                        }}>
                          {est === "aprobada" ? "✓ APR" : est === "regular" ? "REG" : ev === "puedeCursar" ? "→ OK" : "⊘"}
              </div>
                      </div>
                      <div style={{ fontSize: "11px", color: "#3a3a6a", marginTop: "5px", display: "flex", gap: "8px" }}>
                        <span>{mat.cuatrimestre}</span>
                        {mat.correlativas.length > 0 && <span>{mat.correlativas.length} correl.</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra progreso */}
      <div style={{ padding: "0 24px 32px" }}>
        <div style={{ fontSize: "9px", color: "#3a3a6a", marginBottom: "5px", letterSpacing: "2px" }}>PROGRESO GENERAL</div>
        <div style={{ height: "5px", background: "#1a1a2e", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progreso}%`, background: "linear-gradient(90deg, #004422, #00ff88)", borderRadius: "3px", transition: "width 0.4s ease" }} />
        </div>
        <div style={{ fontSize: "10px", color: "#556", marginTop: "4px" }}>{aprobadas} de {total} materias aprobadas</div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "22px", fontWeight: "700", color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "9px", color: "#556", marginTop: "2px" }}>{label}</div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#aaaaee", fontWeight: "500" }}>
      <div style={{ width: "16px", height: "16px", borderRadius: "4px", border: `2px solid ${color}`, background: color + "22" }} />
      {label}
    </div>
  );
}
