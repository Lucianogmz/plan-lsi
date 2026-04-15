import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import { isAuthenticated, getUser, logout as authLogout } from "./services/auth";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Al cargar, verificar si ya hay una sesión activa
    if (isAuthenticated()) {
      setUser(getUser());
    }
    setChecking(false);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
  };

  if (checking) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0a0a14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        color: "#4466cc",
        fontSize: "12px",
        letterSpacing: "3px",
      }}>
        CARGANDO...
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}