import { useState } from "react";
import { login, setAuthToken, signup } from "../services/mcpClient";

export function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response =
        mode === "signup"
          ? await signup({ name: form.name, email: form.email, password: form.password })
          : await login({ email: form.email, password: form.password });

      const { token, user } = response.data;
      localStorage.setItem("mcp_token", token);
      localStorage.setItem("mcp_user", JSON.stringify(user));
      setAuthToken(token);
      onAuth({ token, user });
    } catch (err) {
      setError(err?.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="auth-card">
      <h1>MCP Crypto Trading</h1>
      <p>Secure login to access AI-powered paper trading.</p>
      <form onSubmit={submit}>
        {mode === "signup" && (
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          />
        )}
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
          required
        />
        {error ? <small className="error">{error}</small> : null}
        <button type="submit">{mode === "signup" ? "Create Account" : "Login"}</button>
      </form>
      <button className="ghost" onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}>
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
      </button>
    </div>
  );
}
