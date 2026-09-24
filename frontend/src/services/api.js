const API_URL = import.meta.env.VITE_API_URL || 'https://plan-lsi.onrender.com/api';
const PROGRESO_KEY = 'progreso';

export const fetchMaterias = async () => {
  const res = await fetch(`${API_URL}/materias`);
  if (!res.ok) throw new Error('Error fetching materias');
  return res.json();
};

// El progreso se guarda en el navegador (localStorage)
export const fetchProgreso = () => {
  try {
    return JSON.parse(localStorage.getItem(PROGRESO_KEY)) || {};
  } catch {
    return {};
  }
};

export const saveProgreso = (estados) => {
  try {
    localStorage.setItem(PROGRESO_KEY, JSON.stringify(estados));
  } catch (error) {
    console.error("Error guardando progreso:", error);
  }
};

const CARRERA_KEY = 'carrera';

export const fetchCarrera = () => {
  try {
    return localStorage.getItem(CARRERA_KEY) || 'licenciatura';
  } catch {
    return 'licenciatura';
  }
};

export const saveCarrera = (carrera) => {
  try {
    localStorage.setItem(CARRERA_KEY, carrera);
  } catch (error) {
    console.error("Error guardando carrera:", error);
  }
};
