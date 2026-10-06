import AuthBackground from "../../components/AuthBackground";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const contactNumber = location.state?.contactNumber || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value, index) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Please enter the complete 6-digit OTP.");
      return;
    }

    // Demo OTP verification
    // Replace this with your backend/SMS OTP verification later.
    if (enteredOtp === "123456") {
      navigate("/reset-password/new", {
        state: {
          contactNumber,
        },
      });
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleResendOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    alert("A new OTP has been sent to your phone number.");
  };

  return (
    <AuthBackground>
      <div className="flex min-h-screen flex-col">
        <main
          style={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "50px 20px",
            boxSizing: "border-box",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              maxWidth: "480px",
              boxSizing: "border-box",
              padding: "32px",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              background: "#ffffff",
              boxShadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
            }}
          >
            {/* Header */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "28px",
              }}
            >
              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#16324f",
                }}
              >
                Verify OTP
              </h1>

              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: "#4b5563",
                }}
              >
                We've sent a verification code to your phone number.
              </p>

              {contactNumber && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "12px",
                    padding: "7px 12px",
                    borderRadius: "6px",
                    background: "#f0f9ff",
                    border: "1px solid #bae6fd",
                    color: "#16324f",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  {contactNumber}
                </div>
              )}
            </div>

            {/* OTP Input */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  width: "100%",
                  maxWidth: "362px",
                  margin: "0 auto",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#16324f",
                    lineHeight: "18px",
                    textAlign: "left",
                  }}
                >
                  ENTER OTP
                </label>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] = element;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      aria-label={`OTP digit ${index + 1}`}
                      onChange={(e) =>
                        handleChange(e.target.value, index)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      style={{
                        width: "52px",
                        height: "56px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "7px",
                        background: "#ffffff",
                        textAlign: "center",
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#16324f",
                        outline: "none",
                        boxSizing: "border-box",
                        flexShrink: 0,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#2ca6d8";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(44, 166, 216, 0.12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#cbd5e1";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  ))}
                </div>
              </div>

              <p
                style={{
                  margin: "10px 0 0",
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Enter the 6-digit code sent to your phone.
              </p>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              VERIFY OTP
            </Button>

            {/* Secondary Actions */}
            <div
              style={{
                textAlign: "center",
                marginTop: "22px",
              }}
            >
              <button
                type="button"
                onClick={handleResendOTP}
                style={{
                  border: "none",
                  background: "none",
                  padding: 0,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0077a3",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                Resend OTP
              </button>
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: "14px",
                paddingTop: "14px",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <Link
                to="/login"
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#64748b",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#0077a3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#64748b";
                }}
              >
                Back to Login
              </Link>
            </div>
          </form>
        </main>
      </div>
    </AuthBackground>
  );
}

export default VerifyOTP;