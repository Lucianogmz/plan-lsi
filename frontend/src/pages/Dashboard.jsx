import { useState, useCallback, useEffect } from "react";
import Stat from "../components/Stat";
import LegendItem from "../components/LegendItem";
import { fetchMaterias, fetchProgreso, saveProgreso } from "../services/api";

// Constantes globales
const ESTADOS = { pendiente: "pendiente", regular: "regular", aprobada: "aprobada" };
const ANIOS = [1, 2, 3, 4, 5];
const ANIO_LABELS = ["1° Año", "2° Año", "3° Año", "4° Año", "5° Año"];

const COLORES = {
  pendiente:   { bg: "#111111", border: "#27272a", text: "#a1a1aa", badge: "#27272a" },
  regular:     { bg: "#181811", border: "#4d4011", text: "#facc15", badge: "#3f350d" }, 
  aprobada:    { bg: "#0a1c11", border: "#10b981", text: "#10b981", badge: "#064e3b" },
  puedeCursar: { bg: "#111111", border: "#e4e4e7", text: "#ffffff", badge: "#27272a" },
  noPuede:     { bg: "#050505", border: "#18181b", text: "#52525b", badge: "#18181b" },
};

// Funciones de ayuda
function puedeSerCursada(mat, estados) {
  if (!mat.correlativas || mat.correlativas.length === 0) return true;
  return mat.correlativas.every(c => estados[c] === "regular" || estados[c] === "aprobada");
}

function getEstadoVisual(mat, estados) {
  const e = estados[mat.id];
  if (e === "aprobada") return "aprobada";
  if (e === "regular") return "regular";
  if (mat.nombre && mat.nombre.toLowerCase().includes("optativa")) return "noPuede";
  if (puedeSerCursada(mat, estados)) return "puedeCursar";
  return "noPuede";
}

export default function Dashboard({ user, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [estados, setEstados] = useState({});
  const [saving, setSaving] = useState(false);
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState(false);
  
  const [materias, setMaterias] = useState([]);

  const cargarTodoLocal = async () => {
    try {
      const dataMat = await fetchMaterias();
      
      const materiasLimpias = dataMat.map(m => ({
        ...m,
        id: Number(m.id),
        correlativas: m.correlativas || []
      }));
      setMaterias(materiasLimpias); 

      const dataProg = await fetchProgreso();
      
      if (Array.isArray(dataProg)) {
        const estadosDesdeDB = {};
        dataProg.forEach(item => {
          estadosDesdeDB[item.materia_id] = item.estado;
        });
        setEstados(estadosDesdeDB);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodoLocal();
  }, []);

  const guardarEstadoEnDB = async (materiaId, nuevoEstado) => {
    try {
      setSaving(true);
      await saveProgreso(materiaId, nuevoEstado);
      setSaving(false);
    } catch (error) {
      console.error("Error guardando en la DB:", error);
      setSaving(false);
    }
  };

  const ciclarEstado = useCallback((id) => {
    setEstados(prev => {
      const actual = prev[id] || "pendiente";
      const siguiente = actual === "pendiente" ? "regular" : actual === "regular" ? "aprobada" : "pendiente";
      
      guardarEstadoEnDB(id, siguiente);
      
      return { ...prev, [id]: siguiente };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", color: "#a1a1aa", fontSize: "12px", letterSpacing: "3px" }}>
      CARGANDO...
    </div>
  );

  const aprobadas = Object.values(estados).filter(e => e === "aprobada").length;
  const regulares = Object.values(estados).filter(e => e === "regular").length;
  const total = materias.length;
  const progreso = total > 0 ? Math.round((aprobadas / total) * 100) : 0;

  const hoveredMat = materias.find(m => m.id === hover);
  const selectedMat = materias.find(m => m.id === selected);
  const focusMat = selectedMat || hoveredMat;
  const highlighted = focusMat
  ? new Set([
      focusMat.id,
      ...(focusMat.correlativas || []),                          
      ...materias
        .filter(m => (m.correlativas || []).includes(focusMat.id))
        .map(m => m.id),
    ])
  : null;

  return (
    <div style={{ minHeight: "100vh", background: "#050505", fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, sans-serif", color: "#a1a1aa" }}>

      {/* Header */}
      <div style={{
        background: "#050505",
        borderBottom: "1px solid #27272a",
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
      }}>
        <div>
          <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#a1a1aa", marginBottom: "3px" }}>UADER · FCyT</div>
          <h1 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#ffffff" }}>Licenciatura en Sistemas de Información</h1>
          <div style={{ fontSize: "10px", color: "#a1a1aa", marginTop: "2px" }}>
            {user.email} {saving && <span style={{ color: "#ffffff" }}>· guardando...</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Stat label="Aprobadas" value={aprobadas} color="#10b981" />
          <Stat label="Regulares" value={regulares} color="#facc15" />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "26px", fontWeight: "700", color: "#ffffff", lineHeight: 1 }}>{progreso}%</div>
            <div style={{ fontSize: "9px", color: "#a1a1aa", marginTop: "2px" }}>completado</div>
          </div>
          <button onClick={onLogout} style={{
            padding: "6px 14px", background: "#ffffff", border: "none",
            color: "#000000", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontSize: "10px", fontWeight: "600"
          }}>SALIR</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "16px 24px", display: "flex", gap: "24px", borderBottom: "1px solid #18181b", flexWrap: "wrap", alignItems: "center" }}>
        <LegendItem color="#27272a" label="Pendiente" />
        <LegendItem color="#10b981" label="Aprobada" />
        <LegendItem color="#facc15" label="Regular" />
        <LegendItem color="#e4e4e7" label="Puede cursar" />
        <button 
          onClick={() => setFiltroActivo(!filtroActivo)}
          style={{
            marginLeft: "auto", padding: "6px 12px", borderRadius: "6px",
            background: filtroActivo ? "#ffffff" : "transparent",
            color: filtroActivo ? "#000000" : "#a1a1aa",
            border: filtroActivo ? "1px solid #ffffff" : "1px solid #3f3f46", cursor: "pointer",
            fontSize: "10px", fontWeight: "700", letterSpacing: "1px",
            transition: "all 0.2s ease"
          }}
        >
          {filtroActivo ? "MOSTRANDO: QUÉ PUEDO CURSAR ✕" : "FILTRAR: QUÉ PUEDO CURSAR"}
        </button>
      </div>

      {/* Info correlativas */}
      <div style={{ minHeight: "62px", margin: "10px 24px" }}>
        {focusMat && (
          <div style={{
            padding: "10px 18px",
            background: "#111111", border: "1px solid #27272a", borderRadius: "8px",
            display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap",
            animation: "fadeIn 0.2s ease-in-out" 
          }}>
            <div>
              <span style={{ fontSize: "9px", color: "#a1a1aa", letterSpacing: "2px" }}>CORRELATIVAS DE </span>
              <span style={{ fontSize: "13px", color: "#ffffff", fontWeight: "700" }}>{focusMat.nombre}</span>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {!focusMat.correlativas || focusMat.correlativas.length === 0
                ? <span style={{ fontSize: "11px", color: "#71717a" }}>Sin correlativas — libre</span>
                : focusMat.correlativas.map(cid => {
                    const m = materias.find(x => x.id === cid);
                    const e = estados[cid] || "pendiente";
                    return (
                      <span key={cid} style={{
                        fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                        border: `1px solid ${e === "aprobada" ? "#10b981" : e === "regular" ? "#facc15" : "#27272a"}`,
                        color: e === "aprobada" ? "#10b981" : e === "regular" ? "#facc15" : "#a1a1aa",
                      }}>{m?.nombre || cid}</span>
                    );
                  })}
            </div>
            {selected && (
              <button onClick={() => setSelected(null)} style={{
                marginLeft: "auto", fontSize: "10px", padding: "3px 10px",
                background: "transparent", border: "1px solid #3f3f46", color: "#a1a1aa",
                borderRadius: "4px", cursor: "pointer",
              }}>✕</button>
            )}
          </div>
        )}
      </div>
      
      {/* Materias por año */}
      <div style={{ padding: "12px 24px 24px" }}>
        {ANIOS.map((anio, ai) => {
          const materiasDelAnio = materias.filter(m => m.anio === anio);
          const materiasAMostrar = filtroActivo 
            ? materiasDelAnio.filter(mat => getEstadoVisual(mat, estados) === "puedeCursar")
            : materiasDelAnio;

          if (filtroActivo && materiasAMostrar.length === 0) return null;

          return (
            <div key={anio} style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#52525b", marginBottom: "6px", textTransform: "uppercase" }}>
                ── {ANIO_LABELS[ai]}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px" }}>
                {materiasAMostrar.map(mat => {
                  const ev = getEstadoVisual(mat, estados);
                  const col = COLORES[ev];
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
                        border: isSelected
                        ? "2px solid #ffffff55"
                        : highlighted && highlighted.has(mat.id) && mat.id !== focusMat?.id
                          ? `1px solid ${col.border}cc`     
                          : `1px solid ${col.border}`,
                        cursor: "pointer",
                        opacity: !highlighted
                              ? 0.55                              
                              : mat.id === focusMat?.id
                                ? 1                               
                                : highlighted.has(mat.id)
                                  ? 0.85                          
                                  : 0.12,   
                        transition: "opacity 0.2s ease-out, box-shadow 0.2s ease, border-color 0.2s ease",
                        outline: isSelected ? "2px solid #ffffff" : "none",
                        outlineOffset: "2px",
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
                      <div style={{ fontSize: "11px", color: "#71717a", marginTop: "5px", display: "flex", gap: "8px" }}>
                        <span>{mat.cuatrimestre}</span>
                        {mat.correlativas && mat.correlativas.length > 0 && <span>{mat.correlativas.length} correl.</span>}
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
        <div style={{ fontSize: "9px", color: "#71717a", marginBottom: "5px", letterSpacing: "2px" }}>PROGRESO GENERAL</div>
        <div style={{ height: "5px", background: "#18181b", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progreso}%`, background: "linear-gradient(90deg, #052e16, #10b981)", borderRadius: "3px", transition: "width 0.4s ease" }} />
        </div>
        <div style={{ fontSize: "10px", color: "#a1a1aa", marginTop: "4px" }}>{aprobadas} de {total} materias aprobadas</div>
      </div>
    </div>
  );
}
