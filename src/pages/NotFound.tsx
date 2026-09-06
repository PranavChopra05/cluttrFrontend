import { Link } from "react-router-dom";
import { LuCompass } from "react-icons/lu";
import { EmptyState } from "../components/EmptyState";
import { Button } from "../components/Button";

export const NotFound = () => (
  <div className="grid min-h-screen place-items-center p-4">
    <div className="ambient" />
    <div className="aurora-glow" />
    <div className="relative z-10 text-center">
      <p className="mb-2 text-6xl font-bold tracking-tight text-fg">404</p>
      <EmptyState
        icon={<LuCompass />}
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={<Link to="/"><Button variant="primary" text="Back to Cluttr" /></Link>}
        compact
      />
    </div>
  </div>
);
