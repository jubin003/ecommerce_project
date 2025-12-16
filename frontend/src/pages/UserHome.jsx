import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import SongCard from "../components/SongCard";

export default function UserHome() {
  const [songs, setSongs] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [currentSongId, setCurrentSongId] = useState(null);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch songs
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await API.get("/songs");
        setSongs(res.data);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };
    fetchSongs();
  }, []);

  // Fetch subscription
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await API.get(`/subscription/${userId}`);
        setSubscription(res.data.subscription);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };
    fetchSubscription();
  }, [userId]);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await API.get(`/cart/${userId}`);
        const count = res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartItemCount(count);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCartCount();
  }, [userId]);

  const isSubscribed = subscription?.isActive === true;

  const handlePlaySong = (songId) => {
    setCurrentSongId(songId);
  };

  const handleAddToCart = async (vinylId) => {
    try {
      await API.post("/cart/add", {
        userId,
        vinylId,
        quantity: 1,
      });
      alert("Added to cart!");
      // Update cart count
      const res = await API.get(`/cart/${userId}`);
      const count = res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartItemCount(count);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "white" }}>
      {/* Header/Navigation */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #333",
        }}
      >
        <h2 style={{ margin: 0 }}>Music Store</h2>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          {/* Cart Button */}
          <button
            onClick={() => navigate("/cart")}
            style={{
              padding: "10px 20px",
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              position: "relative",
              fontSize: "16px",
            }}
          >
            🛒 Cart
            {cartItemCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#1db954",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Orders Button */}
          <button
            onClick={() => navigate("/orders")}
            style={{
              padding: "10px 20px",
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            📦 Orders
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            style={{
              padding: "10px 20px",
              background: "#d32f2f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "40px" }}>
        {/* Subscription status */}
        <div style={{ marginBottom: "30px", textAlign: "center" }}>
          {isSubscribed ? (
            <p style={{ color: "#1db954", fontWeight: "bold", fontSize: "18px" }}>
              ✓ Premium Member - Create Playlists & Enjoy Ad-Free Music
            </p>
          ) : (
            <div>
              <p style={{ color: "orange", marginBottom: "15px", fontSize: "18px" }}>
                Upgrade to Premium for unlimited features!
              </p>
              <button
                onClick={() => navigate("/subscriptions")}
                style={{
                  padding: "12px 30px",
                  backgroundColor: "#1db954",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                View Plans
              </button>
            </div>
          )}
        </div>

        <h3 style={{ marginBottom: "20px" }}>Browse Music & Vinyls</h3>

        {/* Song Cards */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {songs.length === 0 ? (
            <p>No songs available</p>
          ) : (
            songs.map((song) => (
              <SongCard
                key={song._id}
                song={song}
                onPlay={handlePlaySong}
                isCurrentlyPlaying={currentSongId === song._id}
                onAddToCart={handleAddToCart}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}