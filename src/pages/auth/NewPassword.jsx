import AuthBackground from "../../components/AuthBackground";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import EditText from "../../components/ui/EditText";

function NewPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const contactNumber = location.state?.contactNumber || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  const passwordRequirements = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const allPasswordRequirementsMet =
    passwordRequirements.minLength &&
    passwordRequirements.uppercase &&
    passwordRequirements.lowercase &&
    passwordRequirements.number &&
    passwordRequirements.special;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      alert("Please enter your new password.");
      return;
    }

    if (!allPasswordRequirementsMet) {
      alert("Please meet all password requirements.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Password update logic can be connected to your backend/storage here.
    setPasswordChanged(true);
  };

  const Requirement = ({ met, children }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        fontSize: "12px",
        color: met ? "#16a34a" : "#64748b",
        marginBottom: "5px",
      }}
    >
      <span
        style={{
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: "700",
          background: met ? "#dcfce7" : "#f1f5f9",
          color: met ? "#16a34a" : "#94a3b8",
          flexShrink: 0,
        }}
      >
        {met ? "✓" : ""}
      </span>

      <span>{children}</span>
    </div>
  );

  if (passwordChanged) {
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
            <div
              style={{
                width: "100%",
                maxWidth: "480px",
                boxSizing: "border-box",
                padding: "32px",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                background: "#ffffff",
                boxShadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 20px",
                  borderRadius: "50%",
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#059669",
                  fontSize: "30px",
                  fontWeight: "700",
                }}
              >
                ✓
              </div>

              <h1
                style={{
                  margin: "0 0 10px",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#16324f",
                }}
              >
                Password Changed
              </h1>

              <p
                style={{
                  margin: "0 0 24px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: "#4b5563",
                }}
              >
                Your password has been successfully changed. You can now
                use your new password to log in.
              </p>

              <Button
                type="button"
                variant="primary"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                BACK TO LOGIN
              </Button>
            </div>
          </main>
        </div>
      </AuthBackground>
    );
  }

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
                Create New Password
              </h1>

              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: "#4b5563",
                }}
              >
                Enter a new password for your account.
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

            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#16324f",
                }}
              >
                NEW PASSWORD
              </label>

              <EditText
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="w-full"
              />
            </div>

            {/* Password Requirements */}
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 14px",
                borderRadius: "7px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                style={{
                  margin: "0 0 9px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#16324f",
                }}
              >
                Password requirements:
              </p>

              <Requirement met={passwordRequirements.minLength}>
                At least 8 characters
              </Requirement>

              <Requirement met={passwordRequirements.uppercase}>
                At least one uppercase letter
              </Requirement>

              <Requirement met={passwordRequirements.lowercase}>
                At least one lowercase letter
              </Requirement>

              <Requirement met={passwordRequirements.number}>
                At least one number
              </Requirement>

              <Requirement met={passwordRequirements.special}>
                At least one special character
              </Requirement>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="confirmPassword"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#16324f",
                }}
              >
                CONFIRM NEW PASSWORD
              </label>

              <EditText
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
                className="w-full"
              />
            </div>

            {confirmPassword && password !== confirmPassword && (
              <p
                style={{
                  margin: "-12px 0 20px",
                  fontSize: "12px",
                  color: "#dc2626",
                }}
              >
                Passwords do not match.
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              CHANGE PASSWORD
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
                  color: "#64748b",
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

export default NewPassword;