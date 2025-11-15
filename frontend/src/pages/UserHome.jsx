import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function UserHome() {
  const [songs, setSongs] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [playlistName, setPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState([]);

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

  // Fetch user's subscription
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

  const isSubscribed = subscription?.isActive === true;

  // Create playlist
  const handleCreatePlaylist = async () => {
    if (!playlistName) return alert("Enter playlist name");
    try {
      const res = await API.post(`/playlists/${userId}`, { name: playlistName });
      setPlaylists([...playlists, res.data]);
      setPlaylistName("");
      alert("Playlist created!");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to create playlist");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Welcome User</h2>
      <button
        onClick={() => logout()}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Logout
      </button>

      {/* Subscription button */}
      {!isSubscribed && (
        <button
          onClick={() => navigate("/subscriptions")}
          style={{ marginBottom: "20px", padding: "10px 20px" }}
        >
          Buy Subscription
        </button>
      )}

      <h3>Songs</h3>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {songs.length === 0 ? (
          <p>No songs available</p>
        ) : (
          songs.map((song) => (
            <div
              key={song._id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
                width: "200px",
                textAlign: "center",
              }}
            >
              <img
                src={song.coverArt || "https://via.placeholder.com/200x150?text=No+Image"}
                alt={song.title}
                style={{ width: "100%", height: "150px" }}
              />
              <p>{song.title}</p>
              <audio controls>
                <source src={`http://localhost:5001/${song.filePath}`} type="audio/mpeg" />
              </audio>
            </div>
          ))
        )}
      </div>

      {/* Playlist section for subscribed users */}
      {isSubscribed && (
        <div style={{ marginTop: "30px" }}>
          <h3>Create Playlist</h3>
          <input
            type="text"
            placeholder="Playlist Name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <button onClick={handleCreatePlaylist} style={{ marginLeft: "10px" }}>
            Create
          </button>

          <h4>Your Playlists</h4>
          <ul>
            {playlists.map((pl) => (
              <li key={pl._id}>{pl.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
