import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function SubscriptionInfo() {
  const [plans, setPlans] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get("/subscriptions"); // GET all subscription plans
        setPlans(res.data);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    try {
      const res = await API.post("/subscriptions/assign", {
        userId,
        subscriptionId: planId,
      });
      alert("Subscribed successfully!");
      navigate("/user-home"); // redirect after subscribing
    } catch (err) {
      alert(err.response?.data?.message || "Subscription failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#0f0f0f",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "40px",
        overflowY: "auto",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
        Upgrade Your Experience
      </h1>

      <p
        style={{
          textAlign: "center",
          maxWidth: "700px",
          margin: "0 auto",
          fontSize: "18px",
          opacity: 0.8,
          marginBottom: "40px",
        }}
      >
        Unlock unlimited music streaming, create playlists, and enjoy ad-free listening with our subscription plans.
      </p>

      {/* Subscription Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "25px",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {plans.length === 0 ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            No subscription plans available.
          </p>
        ) : (
          plans.map((plan) => (
            <div
              key={plan._id}
              style={{
                background: "#171717",
                borderRadius: "12px",
                padding: "25px",
                textAlign: "center",
                border: "1px solid #222",
                transition: "0.25s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(0,255,100,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h2 style={{ marginBottom: "15px" }}>{plan.planName}</h2>
              <p style={{ fontSize: "22px", color: "#1db954", marginBottom: "10px" }}>
                ${plan.price}
              </p>
              <p style={{ opacity: 0.8, marginBottom: "25px" }}>
                Duration: {plan.durationInDays} days
              </p>

              <button
                onClick={() => handleSubscribe(plan._id)}
                style={{
                  padding: "12px 25px",
                  background: "#1db954",
                  border: "none",
                  color: "black",
                  fontWeight: "bold",
                  cursor: "pointer",
                  borderRadius: "8px",
                }}
              >
                Subscribe
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
