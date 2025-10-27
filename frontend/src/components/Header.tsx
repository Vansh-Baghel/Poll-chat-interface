import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "./contexts/auth.context";
import { Button } from "./ui/button";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex justify-between items-center sticky top-0 z-40 p-4 border-b bg-white shadow-sm">
      <h1 className="text-2xl font-semibold">Chats</h1>
      <div className="flex items-center gap-4">
        {!user ? (
          <Button
            className="cursor-pointer"
            onClick={() => navigate({ to: "/login" })}
          >
            Login
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <Button
              className="cursor-pointer"
              onClick={handleLogout}
              size="sm"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
