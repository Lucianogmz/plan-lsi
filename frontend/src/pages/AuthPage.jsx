import { useState } from "react";
import { login, register } from "../services/auth";

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (e) => e.includes("@") && e.includes(".com");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("El email debe contener @ y .com");
      return;
    }
    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const data = isLogin
        ? await login(email, password)
        : await register(email, password);
      
      setShowSuccess(true);
      setTimeout(() => {
        onAuthSuccess(data.user);
      }, 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setConfirmPassword("");
  };

  return (
    <div className="auth-container">
      {/* Animated background orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      <div className={`auth-card ${showSuccess ? "auth-card-success" : ""}`}>
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
          </div>
          <div className="auth-brand-tag">UADER · FCyT</div>
          <h1 className="auth-title">Plan LSI</h1>
          <p className="auth-subtitle">Licenciatura en Sistemas de Información</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? "auth-tab-active" : ""}`}
            onClick={() => switchMode()}
            type="button"
            disabled={isLogin}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab ${!isLogin ? "auth-tab-active" : ""}`}
            onClick={() => switchMode()}
            type="button"
            disabled={!isLogin}
          >
            Registrarse
          </button>
          <div
            className="auth-tab-indicator"
            style={{ transform: isLogin ? "translateX(0)" : "translateX(100%)" }}
          />
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-email">Email</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                id="auth-email"
                type="text"
                className="auth-input"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-password">Contraseña</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="auth-password"
                type="password"
                className="auth-input"
                placeholder="Mínimo 4 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="auth-field auth-field-enter">
              <label className="auth-label" htmlFor="auth-confirm">Confirmar Contraseña</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <input
                  id="auth-confirm"
                  type="password"
                  className="auth-input"
                  placeholder="Repetí tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="auth-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`auth-submit ${loading ? "auth-submit-loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <div className="auth-spinner" />
            ) : showSuccess ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : isLogin ? (
              "Ingresar"
            ) : (
              "Crear cuenta"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          {isLogin ? "¿No tenés cuenta? " : "¿Ya tenés cuenta? "}
          <button type="button" className="auth-link" onClick={switchMode}>
            {isLogin ? "Registrate" : "Iniciá sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
