import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { LuBrain } from "react-icons/lu";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

const Landing = lazy(() => import("./pages/Landing").then((m) => ({ default: m.Landing })));
const Signin = lazy(() => import("./pages/Signin").then((m) => ({ default: m.Signin })));
const Signup = lazy(() => import("./pages/Signup").then((m) => ({ default: m.Signup })));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SharedBrain = lazy(() => import("./pages/SharedBrain").then((m) => ({ default: m.SharedBrain })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

const FullPageLoader = () => (
  <div className="grid min-h-screen place-items-center">
    <div className="ambient" />
    <div className="relative z-10 flex flex-col items-center gap-4">
      <div className="grid h-12 w-12 animate-pulse place-items-center rounded-2xl bg-accent-soft text-accent">
        <LuBrain size={22} />
      </div>
      <span className="text-sm text-subtle">Loading Cluttr…</span>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <FullPageLoader />;
  if (!token) return <Navigate to="/signin" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { token } = useAuth();
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={token ? <Navigate to="/dashboard" replace /> : <Signin />} />
        <Route path="/signup" element={token ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/share/:hash" element={<SharedBrain />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const ThemedToaster = () => {
  const { resolved } = useTheme();
  return <Toaster position="bottom-right" richColors theme={resolved} closeButton />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MotionConfig reducedMotion="user">
          <ThemedToaster />
          <Router>
            <AppRoutes />
          </Router>
        </MotionConfig>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
