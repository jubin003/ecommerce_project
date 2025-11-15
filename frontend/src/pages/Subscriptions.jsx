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
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>Upgrade Your Experience</h1>
      <p style={{ maxWidth: "600px", margin: "auto", marginBottom: "20px" }}>
        Enjoy unlimited music streaming, create playlists, and access exclusive features with our subscription plans.
      </p>

      <h2>Choose a Plan</h2>

      {plans.length === 0 ? (
        <p>No subscription plans available.</p>
      ) : (
        plans.map((plan) => (
          <div
            key={plan._id}
            style={{
              marginBottom: "20px",
              border: "1px solid gray",
              padding: "20px",
              display: "inline-block",
              width: "300px",
              borderRadius: "10px",
            }}
          >
            <h3>{plan.planName}</h3>
            <p>Price: ${plan.price}</p>
            <p>Duration: {plan.durationInDays} days</p>

            <button
              onClick={() => handleSubscribe(plan._id)}
              style={{ padding: "10px 20px", marginTop: "10px" }}
            >
              Subscribe
            </button>
          </div>
        ))
      )}
    </div>
  );
}
