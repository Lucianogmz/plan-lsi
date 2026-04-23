import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchMaterias = async () => {
  const res = await fetch(`${API_URL}/materias`);
  if (!res.ok) throw new Error('Error fetching materias');
  return res.json();
};

export const fetchProgreso = async () => {
  const res = await fetch(`${API_URL}/progreso`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Error fetching progreso');
  return res.json();
};

export const saveProgreso = async (materiaId, estado) => {
  const res = await fetch(`${API_URL}/progreso`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ materia_id: materiaId, estado }),
  });
  if (!res.ok) throw new Error('Error saving progreso');
  return res.json();
};
