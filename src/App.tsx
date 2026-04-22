import Dashboard from "./pages/Dashboard";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { SharedBrain } from "./pages/SharedBrain";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "sonner";
import { FaBrain } from "react-icons/fa";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();
  
  if (isLoading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/10 flex items-center justify-center animate-pulse">
            <FaBrain className="text-cyan-400 text-2xl" />
          </div>
          <div className="absolute inset-0 w-14 h-14 rounded-2xl border-2 border-cyan-500/20 border-t-cyan-500 animate-[spin-slow_2s_linear_infinite]" />
        </div>
        <span className="text-sm text-slate-500 animate-pulse tracking-wide">Loading Cluttr...</span>
      </div>
    </div>
  );
  if (!token) return <Navigate to="/signin" />;
  
  return <>{children}</>;
};

const Layout = () => {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/signin" element={token ? <Navigate to="/dashboard" /> : <Signin />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/share/:hash" element={<SharedBrain />} />
      <Route
        path="/"
        element={<Navigate to="/dashboard" />}
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="bottom-right" 
        richColors 
        theme="dark" 
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            color: '#f1f5f9',
          }
        }}
      />
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;