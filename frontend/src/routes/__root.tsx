import { AuthProvider } from "@/components/contexts/auth.context";
import Header from "@/components/Header";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="h-screen">
      <AuthProvider>
        <Header />
        <Outlet />
        <Toaster
          position="top-right"
          expand
          duration={2000}
          closeButton
        />
      </AuthProvider>
    </div>
  );
}
