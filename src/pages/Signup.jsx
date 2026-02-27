import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "@/api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/signup", {
        email,
        password,
      });

      alert(res.data.message);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
      <Card className="w-[400px] shadow-2xl">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-green-800">
            Create Account
          </h2>

          <Input
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="w-full bg-green-700 hover:bg-green-800 transition"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating..." : "Signup"}
          </Button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/" className="text-green-700 font-semibold">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}