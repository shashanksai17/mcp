import { useEffect, useState } from "react";
import { AuthPanel } from "./components/AuthPanel";
import { TradingDashboard } from "./components/TradingDashboard";
import { setAuthToken } from "./services/mcpClient";

function loadAuth() {
  const token = localStorage.getItem("mcp_token");
  const rawUser = localStorage.getItem("mcp_user");
  if (!token || !rawUser) return null;

  try {
    return { token, user: JSON.parse(rawUser) };
  } catch {
    return null;
  }
}

export default function App() {
  const [auth, setAuth] = useState(loadAuth());

  useEffect(() => {
    if (auth?.token) {
      setAuthToken(auth.token);
    }
  }, [auth]);

  const logout = () => {
    localStorage.removeItem("mcp_token");
    localStorage.removeItem("mcp_user");
    setAuthToken(null);
    setAuth(null);
  };

  if (!auth) {
    return <AuthPanel onAuth={setAuth} />;
  }

  return <TradingDashboard token={auth.token} user={auth.user} onLogout={logout} />;
}
