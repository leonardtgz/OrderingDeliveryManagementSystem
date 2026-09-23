import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Droplets,
  Eye,
  EyeOff,
  Truck,
  ShieldCheck,
} from "lucide-react";

import AuthBackground from "../../components/AuthBackground";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      navigate("/admin/dashboard");
      return;
    }

    if (username === "customer" && password === "customer123") {
      navigate("/customer/home");
      return;
    }

    alert("Invalid username or password. Please try again.");
  };

  return (
    <AuthBackground>
      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid w-full max-w-[1150px] grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">

          {/* ========================================
              LEFT BRANDING / DESIGN
          ======================================== */}

          <section className="animate-slide-up hidden lg:block">
            <div className="flex flex-col gap-6">

              {/* Main Heading */}
              <div className="flex flex-col gap-4">
                <h1 className="max-w-[520px] text-4xl font-bold leading-tight tracking-[-1px] text-[#16324F] xl:text-5xl">
                  Welcome to{" "}
                  <span className="text-[#08779D]">
                    GoldenPR
                  </span>
                </h1>

                <p className="max-w-[500px] text-base leading-7 text-[#526777]">
                  Your trusted source for clean,
                  purified drinking water delivered
                  straight to your doorstep.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="mt-2 flex flex-col gap-3">

                {/* Pure & Safe Water */}
                <div className="animate-slide-up-soft flex items-center gap-4 rounded-xl border border-[#D7E8EE] bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DDF6FB]">
                    <Droplets
                      className="h-6 w-6 text-[#08779D]"
                      strokeWidth={2}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#16324F]">
                      Pure & Safe Water
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#687985]">
                      Clean and purified water you
                      can trust every day.
                    </p>
                  </div>
                </div>

                {/* Fast Delivery */}
                <div
                  className="animate-slide-up-soft flex items-center gap-4 rounded-xl border border-[#D7E8EE] bg-white/80 p-4 shadow-sm backdrop-blur-sm"
                  style={{
                    animationDelay: "100ms",
                  }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DDF6FB]">
                    <Truck
                      className="h-6 w-6 text-[#08779D]"
                      strokeWidth={2}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#16324F]">
                      Fast Delivery
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#687985]">
                      Convenient water delivery when
                      you need it.
                    </p>
                  </div>
                </div>

                {/* Fresh Every Day */}
                <div
                  className="animate-slide-up-soft flex items-center gap-4 rounded-xl border border-[#D7E8EE] bg-white/80 p-4 shadow-sm backdrop-blur-sm"
                  style={{
                    animationDelay: "200ms",
                  }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DDF6FB]">
                    <ShieldCheck
                      className="h-6 w-6 text-[#08779D]"
                      strokeWidth={2}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#16324F]">
                      Fresh Every Day
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#687985]">
                      Quality water prepared with
                      your health in mind.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Statement */}
              <div
                className="animate-slide-up-soft mt-4"
                style={{
                  animationDelay: "300ms",
                }}
              >
                <p className="text-xs font-bold tracking-[2px] text-[#08779D]">
                  WATER YOU CAN COUNT ON
                </p>
              </div>
            </div>
          </section>

          {/* ========================================
              LOGIN CARD
          ======================================== */}

          <section
            className="animate-slide-up w-full"
            style={{
              animationDelay: "150ms",
            }}
          >
            <div className="mx-auto w-full max-w-[460px] rounded-2xl border border-[#D5E5EA] bg-white/95 p-6 shadow-[0_20px_60px_rgba(0,70,100,0.12)] backdrop-blur-sm sm:p-8">

              {/* Card Header */}
              <div className="mb-7 flex flex-col items-center text-center">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#DDF6FB]">
                  <Droplets
                    className="h-8 w-8 text-[#08779D]"
                    strokeWidth={2}
                  />
                </div>

                <h2 className="text-2xl font-bold tracking-[-0.3px] text-[#16324F]">
                  Login to Your Account
                </h2>

                <p className="mt-2 max-w-[320px] text-sm leading-6 text-[#687985]">
                  Enter your account details to
                  continue to GoldenPR.
                </p>
              </div>

              {/* Login Form */}
              <form
                onSubmit={handleLogin}
                className="flex flex-col gap-5"
              >

                {/* Username */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="username"
                    className="text-xs font-bold uppercase tracking-[0.6px] text-[#16324F]"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    placeholder="Enter your username"
                    required
                    className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white px-4 text-sm text-[#16324F] outline-none transition-all placeholder:text-[#94A3B8] focus:border-[#08779D] focus:ring-2 focus:ring-[#08779D]/15"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-xs font-bold uppercase tracking-[0.6px] text-[#16324F]"
                    >
                      Password
                    </label>

                    <Link
                      to="/reset-password"
                      className="text-xs font-semibold text-[#08779D] transition-opacity hover:opacity-70"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white px-4 pr-12 text-sm text-[#16324F] outline-none transition-all placeholder:text-[#94A3B8] focus:border-[#08779D] focus:ring-2 focus:ring-[#08779D]/15"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword,
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#8A9AA5] transition-colors hover:text-[#08779D]"
                    >
                      {showPassword ? (
                        <EyeOff
                          className="h-5 w-5"
                          strokeWidth={2}
                        />
                      ) : (
                        <Eye
                          className="h-5 w-5"
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#08779D] px-4 text-sm font-bold tracking-[0.5px] text-white shadow-sm transition-all duration-200 hover:bg-[#066783] hover:shadow-md active:scale-[0.99]"
                >
                  LOGIN
                </button>
              </form>

              {/* Create Account */}
              <div className="mt-6 text-center">
                <span className="text-sm text-[#687985]">
                  Don't have an account?{" "}
                </span>

                <Link
                  to="/signup"
                  className="text-sm font-bold text-[#08779D] transition-opacity hover:opacity-70"
                >
                  Create Account
                </Link>
              </div>

              {/* Trust Message */}
              <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#E5EDF0] pt-5">
                <ShieldCheck
                  className="h-4 w-4 text-[#08779D]"
                  strokeWidth={2}
                />

                <span className="text-[11px] text-[#7A8A94]">
                  Your information is securely
                  protected.
                </span>
              </div>
            </div>
          </section>

          {/* ========================================
              MOBILE BRANDING
          ======================================== */}

          <div className="animate-slide-up order-first flex flex-col items-center text-center lg:hidden">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 shadow-sm">
              <Droplets
                className="h-7 w-7 text-[#08779D]"
                strokeWidth={2}
              />
            </div>

            <h1 className="mt-2 text-2xl font-bold text-[#16324F]">
              Welcome to{" "}
              <span className="text-[#08779D]">
                GoldenPR
              </span>
            </h1>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
}

export default Login;