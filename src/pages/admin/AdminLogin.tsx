import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#16161F" }}>
      <div className="w-full max-w-md p-8 rounded-2xl border" style={{ backgroundColor: "#1E1E2E", borderColor: "#2A2A3A" }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-wider uppercase" style={{ color: "#C9A96E" }}>
            Zillbirds
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#9999B0" }}>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1.5 font-medium" style={{ color: "#9999B0" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors focus:ring-2"
              style={{
                backgroundColor: "#16161F",
                borderColor: "#2A2A3A",
                border: "1px solid #2A2A3A",
                color: "#F9F6F2",
              }}
              placeholder="admin@zillbirds.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5 font-medium" style={{ color: "#9999B0" }}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-12"
                style={{
                  backgroundColor: "#16161F",
                  border: "1px solid #2A2A3A",
                  color: "#F9F6F2",
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: "#9999B0" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(231,76,60,0.1)", color: "#E74C3C" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            style={{ backgroundColor: "#C9A96E", color: "#16161F" }}
          >
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
