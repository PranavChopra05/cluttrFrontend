import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LuUser, LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import { toast } from "sonner";
import { Button } from "../components/Button";
import { AuthShell } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import api, { errMessage } from "../lib/api";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const signIn = async () => {
    if (!username.trim() || !password) {
      setError("Please enter your username and password");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await api.post("/api/v1/signin", { username: username.trim(), password });
      if (res.data.token) {
        login(res.data.token, res.data.user);
        toast.success("Welcome back");
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(errMessage(err, "Sign in failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const field = "w-full rounded-xl border border-border bg-surface-2 py-2.5 pl-10 pr-4 text-sm text-fg placeholder:text-subtle transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-ring";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted";

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your second brain"
      footer={<>Don't have an account? <Link to="/signup" className="font-semibold text-accent hover:underline">Create one</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); signIn(); }}>
        <div>
          <label className={label} htmlFor="username">Username</label>
          <div className="relative">
            <LuUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" size={15} />
            <input id="username" value={username} autoFocus autoComplete="username"
              onChange={(e) => setUsername(e.target.value)} placeholder="your username" className={field} />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="password">Password</label>
          <div className="relative">
            <LuLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" size={15} />
            <input id="password" type={showPw ? "text" : "password"} value={password} autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`${field} pr-10`} />
            <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-subtle hover:text-fg">
              {showPw ? <LuEyeOff size={15} /> : <LuEye size={15} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-danger" role="alert">{error}</p>}

        <Button type="submit" fullWidth variant="primary" text="Sign in" isLoading={isLoading} />
      </form>
    </AuthShell>
  );
};
