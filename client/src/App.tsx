import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import type { ComponentType } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomeSupremePremium from "./pages/HomeSupremePremium";
import Portfolio from "./pages/Portfolio";
import AdminDashboard from "./pages/AdminDashboard";
import AutomationPanel from "./pages/AutomationPanel";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: ComponentType; adminOnly?: boolean }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08070f] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-violet-300" aria-label="Cargando" />
      </div>
    );
  }

  if (!isAuthenticated || (adminOnly && user?.role !== "admin")) {
    return <HomeSupremePremium />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeSupremePremium} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={AdminDashboard} adminOnly />} />
      <Route path="/automations" component={() => <ProtectedRoute component={AutomationPanel} adminOnly />} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
