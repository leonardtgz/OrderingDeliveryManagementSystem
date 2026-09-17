import AuthBackground from "../../components/AuthBackground";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Droplets,
  Truck,
  ShieldCheck,
} from "lucide-react";

import Button from "../../components/ui/Button";

import EditText from "../../components/ui/EditText";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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
    <AuthBackground>
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:py-10">
          <div className="grid w-full max-w-[1100px] grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">

            {/* LEFT BRANDING */}
            <section className="flex flex-col justify-center px-2 text-center lg:px-4 lg:text-left">
              <div className="mb-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-text-accent sm:text-xs lg:justify-start">
                <span>Clean Water</span>
                <span className="text-[#7CCFE0]">•</span>
                <span>Healthy Living</span>
                <span className="text-[#7CCFE0]">•</span>
                <span>Delivered</span>
              </div>

              <h1 className="text-3xl font-bold leading-tight tracking-[-0.5px] text-[#16324F] sm:text-4xl lg:text-5xl">
                Welcome Back to
                <span className="block text-[#0782AE]">
                  GoldenPR
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-[520px] text-sm leading-6 text-text-secondary sm:text-base lg:mx-0 lg:text-lg lg:leading-7">
                Your trusted water delivery service,
                providing clean and reliable water
                straight to your doorstep.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-9 lg:max-w-[600px]">

                {/* Pure Water */}
                <div className="flex items-center gap-3 rounded-lg border border-[#D7EEF4] bg-white/70 p-3 backdrop-blur-sm sm:flex-col sm:items-start sm:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDF6FB] text-[#0782AE]">
                    <Droplets size={21} />
                  </div>

                  <div className="text-left">
                    <p className="text-xs font-bold text-[#16324F] sm:text-sm">
                      Pure & Safe Water
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-text-secondary sm:text-xs">
                      Quality you can trust
                    </p>
                  </div>
                </div>

                {/* Fast Delivery */}
                <div className="flex items-center gap-3 rounded-lg border border-[#D7EEF4] bg-white/70 p-3 backdrop-blur-sm sm:flex-col sm:items-start sm:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDF6FB] text-[#0782AE]">
                    <Truck size={21} />
                  </div>

                  <div className="text-left">
                    <p className="text-xs font-bold text-[#16324F] sm:text-sm">
                      Fast Delivery
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-text-secondary sm:text-xs">
                      Reliable doorstep service
                    </p>
                  </div>
                </div>

                {/* Fresh Water */}
                <div className="flex items-center gap-3 rounded-lg border border-[#D7EEF4] bg-white/70 p-3 backdrop-blur-sm sm:flex-col sm:items-start sm:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDF6FB] text-[#0782AE]">
                    <ShieldCheck size={21} />
                  </div>

                  <div className="text-left">
                    <p className="text-xs font-bold text-[#16324F] sm:text-sm">
                      Fresh Every Day
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-text-secondary sm:text-xs">
                      Made convenient for you
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 hidden items-center gap-3 lg:flex">
                <div className="h-px w-12 bg-[#9DDEEC]" />

                <p className="text-xs font-semibold tracking-[0.5px] text-text-secondary">
                  WATER YOU CAN COUNT ON
                </p>
              </div>
            </section>

            {/* LOGIN CARD */}
            <section className="w-full">
              <div className="mx-auto w-full max-w-[480px] rounded-xl border border-[#CFE6EE] bg-white/95 p-5 shadow-[0_12px_40px_rgba(0,105,148,0.10)] backdrop-blur-sm sm:p-7 lg:p-8">

                <div className="mb-6 flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#DDF6FB] text-[#0782AE]">
                    <Droplets size={29} strokeWidth={2} />
                  </div>

                  <h2 className="text-xl font-bold text-[#16324F] sm:text-2xl">
                    Login to Your Account
                  </h2>

                  <p className="mt-1.5 text-sm text-text-secondary">
                    Enter your credentials to continue
                  </p>
                </div>

                <form
                  onSubmit={handleLogin}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="email"
                      className="text-xs font-bold uppercase tracking-[0.4px] text-[#16324F]"
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

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="password"
                      className="text-xs font-bold uppercase tracking-[0.4px] text-[#16324F]"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <EditText
                        id="password"
                        name="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange("password")}
                        autoComplete="current-password"
                        className="pr-10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-text-primary"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        to="/reset-password"
                        className="text-xs font-semibold text-text-accent transition-opacity hover:opacity-70 hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                    >
                      LOGIN
                    </Button>

                    <Link
                      to="/signup"
                      className="w-full"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-2 border-[#238FA3] text-[#238FA3]"
                      >
                        CREATE ACCOUNT
                      </Button>
                    </Link>
                  </div>
                </form>

                <div className="mt-6 border-t border-[#E2EEF2] pt-4 text-center">
                  <p className="text-[10px] leading-4 text-text-secondary sm:text-xs">
                    Secure access to your GoldenPR
                    water delivery account.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </AuthBackground>
  );
}

export default Login;