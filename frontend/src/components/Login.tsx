import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import axios from "axios";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { showSuccessToast } from "@/lib/utils";
import { useAuth } from "./contexts/auth.context";
import { loginWithPassword } from "@/apis";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const exampleAccounts = [
    { email: "alice@example.com", password: "alice123" },
    { email: "bob@example.com", password: "bob123" },
    { email: "charlie@example.com", password: "charlie123" },
    { email: "diana@example.com", password: "diana123" },
  ];

  const handleLogin = async () => {
    try {
      const res = await loginWithPassword(email, password);

      setMessage(`Welcome, ${res.data.name}!`);
      
      showSuccessToast("Login successful!");
      const userData = { id: res.data.id, email: res.data.email, name: res.data.name };

      login(userData, res.data.access_token);
      navigate({ to: "/" });
    } catch (err) {
      setMessage("Please use the demo accounts below to log in.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle className="text-center text-xl">Login</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div>
            <Label>Password</Label>
            <div className="flex items-center gap-2">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="flex-1"
              />
              <Button
                type="button"
                className="px-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </Button>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full mt-2"
          >
            Login
          </Button>

          {message && (
            <p className="text-sm text-center mt-2 text-muted-foreground">
              {message}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
          <p className="font-medium mb-1 text-2xl text-center w-full">
            Demo Accounts
          </p>
          {exampleAccounts.map((acc) => (
            <div key={acc.email} className="flex justify-between w-full">
              <span>{acc.email}</span>
              <span className="font-mono">{acc.password}</span>
            </div>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
}
