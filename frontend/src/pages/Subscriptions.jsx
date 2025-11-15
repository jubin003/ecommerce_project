import { useEffect, useState } from "react";
import API from "../api";

export default function Subscriptions() {
  const [plans, setPlans] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await API.get("/subscriptions");
      setPlans(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubscribe = async (planId) => {
    if (!userId) return alert("Login first");
    try {
      const res = await API.post("/subscriptions/assign", {
        userId,
        subscriptionId: planId
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error subscribing");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Subscription Plans</h2>
      {plans.length === 0 ? (
        <p>No subscription plans available.</p>
      ) : (
        plans.map(plan => (
          <div key={plan._id} style={{ marginBottom: "20px", border: "1px solid gray", padding: "10px", display: "inline-block" }}>
            <strong>{plan.planName}</strong><br/>
            Price: ${plan.price}<br/>
            Duration: {plan.durationInDays} days<br/>
            <button onClick={() => handleSubscribe(plan._id)}>Subscribe</button>
          </div>
        ))
      )}
    </div>
  );
}
