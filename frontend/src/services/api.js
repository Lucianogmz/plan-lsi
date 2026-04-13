const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const fetchMaterias = async () => {
  const res = await fetch(`${API_URL}/materias`);
  if (!res.ok) throw new Error('Error fetching materias');
  return res.json();
};

export const fetchProgreso = async (userId) => {
  const res = await fetch(`${API_URL}/progreso/${userId}`);
  if (!res.ok) throw new Error('Error fetching progreso');
  return res.json();
};

export const saveProgreso = async (userId, materiaId, estado) => {
  const res = await fetch(`${API_URL}/progreso`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, materia_id: materiaId, estado })
  });
  if (!res.ok) throw new Error('Error saving progreso');
  return res.json();
};
