import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import EditText from "../../components/ui/EditText";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      formData.email === "admin" &&
      formData.password === "admin123"
    ) {
      navigate("/admin/dashboard");
    } else if (
      formData.email === "customer" &&
      formData.password === "customer123"
    ) {
      navigate("/customer/home");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-[480px]">
          <div className="rounded-md border border-border-light bg-background-card p-6 shadow-sm">
            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-4"
            >
              {/* Email / Username */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-xs font-bold uppercase text-text-secondary"
                >
                  Email / Username
                </label>

                <EditText
                  id="email"
                  name="email"
                  placeholder="Enter your username"
                  value={formData.email}
                  onChange={handleChange("email")}
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-xs font-bold uppercase text-text-secondary"
                >
                  Password
                </label>

                <EditText
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  autoComplete="current-password"
                />

                <div className="flex justify-end">
                  <Link
                    to="/reset-password"
                    className="text-xs font-semibold text-text-accent hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Login / Create Account */}
              <div className="mt-2 flex flex-col gap-3">
                <Button type="submit" variant="primary">
                  LOGIN
                </Button>

                <div className="flex justify-center">
                  <Link to="/signup">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-2 border-[#238FA3] px-8 text-[#238FA3]"
                    >
                      CREATE ACCOUNT
                    </Button>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;