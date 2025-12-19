import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "#1a1a1a",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        {/* Failed Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "#d32f2f",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 30px",
          }}
        >
          <span style={{ fontSize: "50px" }}>✗</span>
        </div>

        <h1 style={{ marginBottom: "15px", color: "#d32f2f" }}>Payment Failed</h1>
        <p style={{ fontSize: "18px", marginBottom: "30px", color: "#b3b3b3" }}>
          Sorry, we couldn't process your payment. Please try again.
        </p>

        <div
          style={{
            background: "#0f0f0f",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
          }}
        >
          <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#888" }}>
            If you're experiencing issues with payment, please contact our support team.
          </p>
        </div>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/checkout")}
            style={{
              padding: "12px 30px",
              background: "#1db954",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/user-home")}
            style={{
              padding: "12px 30px",
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}