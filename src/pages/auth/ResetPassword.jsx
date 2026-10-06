import AuthBackground from "../../components/AuthBackground";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import EditText from "../../components/ui/EditText";

function ResetPassword() {
  const [contactNumber, setContactNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!contactNumber) return;

    navigate("/verify-otp", {
      state: {
        contactNumber,
      },
    });
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
              padding: "24px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "24px",
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
                Forgot Password
              </h1>

              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#4b5563",
                }}
              >
                Enter your phone number and we'll send you a verification
                code.
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="contactNumber"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#16324f",
                }}
              >
                CONTACT NUMBER (PH)
              </label>

              <EditText
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="0917 123 4567"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              SEND OTP
            </Button>

            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <Link
                to="/login"
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0077a3",
                  textDecoration: "none",
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

export default ResetPassword;