import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LuUser, LuLock, LuEye, LuEyeOff, LuCheck } from "react-icons/lu";
import { toast } from "sonner";
import { Button } from "../components/Button";
import { AuthShell } from "../components/AuthShell";
import api, { errMessage } from "../lib/api";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const rules = {
    username: username.trim().length >= 3,
    password: password.length >= 6,
  };

  const signUp = async () => {
    if (!rules.username) return setError("Username must be at least 3 characters");
    if (!rules.password) return setError("Password must be at least 6 characters");
    setError("");
    setIsLoading(true);
    try {
      await api.post("/api/v1/signup", { username: username.trim(), password });
      toast.success("Account created — sign in to continue");
      navigate("/signin");
    } catch (err) {
      setError(errMessage(err, "Sign up failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const field = "w-full rounded-xl border border-border bg-surface-2 py-2.5 pl-10 pr-4 text-sm text-fg placeholder:text-subtle transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-ring";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted";

  const Rule = ({ ok, text }: { ok: boolean; text: string }) => (
    <span className={`inline-flex items-center gap-1 text-[11px] ${ok ? "text-success" : "text-subtle"}`}>
      <LuCheck size={11} className={ok ? "opacity-100" : "opacity-40"} /> {text}
    </span>
  );

  return (
    <AuthShell
      title="Create your brain"
      subtitle="Start saving everything worth keeping"
      footer={<>Already have an account? <Link to="/signin" className="font-semibold text-accent hover:underline">Sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); signUp(); }}>
        <div>
          <label className={label} htmlFor="username">Username</label>
          <div className="relative">
            <LuUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" size={15} />
            <input id="username" value={username} autoFocus autoComplete="username"
              onChange={(e) => setUsername(e.target.value)} placeholder="pick a username" className={field} />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="password">Password</label>
          <div className="relative">
            <LuLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" size={15} />
            <input id="password" type={showPw ? "text" : "password"} value={password} autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)} placeholder="at least 6 characters" className={`${field} pr-10`} />
            <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-subtle hover:text-fg">
              {showPw ? <LuEyeOff size={15} /> : <LuEye size={15} />}
            </button>
          </div>
          <div className="mt-2 flex gap-3">
            <Rule ok={rules.username} text="3+ char username" />
            <Rule ok={rules.password} text="6+ char password" />
          </div>
        </div>

        {error && <p className="text-sm text-danger" role="alert">{error}</p>}

        <Button type="submit" fullWidth variant="primary" text="Create account" isLoading={isLoading} />
      </form>
    </AuthShell>
  );
};
