import { useEffect, useState } from "react";
import API from "../api";
import SongCard from "../components/SongCard";
import { useNavigate } from "react-router-dom";

export default function UserHome() {
  const [songs, setSongs] = useState([]);
  const [subscription, setSubscription] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await API.get("/songs");
        setSongs(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const checkSubscription = async () => {
      try {
        const res = await API.get(`/subscriptions/user/${userId}`);
        setSubscription(res.data.hasSubscription);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSongs();
    checkSubscription();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Welcome User</h2>

      {!subscription && (
        <button onClick={() => navigate("/subscriptions")}>Buy Subscription</button>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>
        {songs.map(song => (
          <SongCard key={song._id} song={song} />
        ))}
      </div>

      {subscription && (
        <button onClick={() => navigate("/playlists")} style={{ marginTop: "20px" }}>
          Create Playlist
        </button>
      )}
    </div>
  );
}
