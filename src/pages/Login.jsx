import React, { useState } from "react";
import { apiLogin, apiRegister } from "../services/auth";

export function Login({ onSuccess, onCancel }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function handle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      let data;
      if (mode === "login") {
        data = await apiLogin(form.email, form.password);
      } else {
        data = await apiRegister(form.name, form.email, form.password);
      }
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          Loom <i>&amp;</i> Field
        </div>
        <p className="auth-tagline">Menswear crafted for every day.</p>

        {/* Tab switcher */}
        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "active" : ""}
            onClick={() => { setMode("login"); setError(""); }}
            type="button"
          >
            Sign in
          </button>
          <button
            role="tab"
            aria-selected={mode === "register"}
            className={mode === "register" ? "active" : ""}
            onClick={() => { setMode("register"); setError(""); }}
            type="button"
          >
            Create account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="auth-form" noValidate>
          {mode === "register" && (
            <label>
              Full name
              <input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={form.name}
                onChange={handle}
                required
                minLength={2}
                maxLength={100}
                disabled={busy}
              />
            </label>
          )}

          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handle}
              required
              disabled={busy}
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder={mode === "register" ? "Min. 6 characters" : "Your password"}
              value={form.password}
              onChange={handle}
              required
              minLength={6}
              disabled={busy}
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-submit" disabled={busy}>
            {busy
              ? mode === "login" ? "Signing in…" : "Creating account…"
              : mode === "login" ? "Sign in" : "Create account"}
          </button>
          {onCancel && (
            <button
              type="button"
              className="auth-guest"
              onClick={onCancel}
              disabled={busy}
            >
              Continue as guest
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
