import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "@/api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
      

  <div className="min-h-screen flex items-center justify-center bg-stone-50">
    <Card className="w-[400px] shadow-xl border bg-white">
      <CardContent className="p-8 space-y-6">

        <h2 className="text-3xl font-bold text-center text-emerald-700">
          Renovation Tracker
        </h2>

        <Input
          placeholder="Email"
          type="email"
          className="focus:ring-2 focus:ring-emerald-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          className="focus:ring-2 focus:ring-emerald-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 transition"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-emerald-600 font-semibold">
            Sign up
          </Link>
        </p>

      </CardContent>
    </Card>
  </div>
  );
}