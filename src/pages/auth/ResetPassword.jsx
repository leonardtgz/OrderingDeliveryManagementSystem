import { useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import EditText from "../../components/ui/EditText";

function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return;

    alert("Reset link sent!");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#ffffff",
      }}
    >
      <Header />

      <main
        style={{
          width: "100%",
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
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "12px",
                fontWeight: "700",
                color: "#16324f",
              }}
            >
              EMAIL ADDRESS
            </label>

            <EditText
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., user@example.com"
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
          >
            SEND RESET LINK
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
  );
}

export default ResetPassword;