import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import SongCard from "../components/SongCard"; // ✅ IMPORT

export default function UserHome() {
  const [songs, setSongs] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);

  const [currentSongId, setCurrentSongId] = useState(null); // ✅ NEW

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

  // Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await API.get(`/playlists/user/${userId}`);
        setPlaylists(res.data);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };
    if (subscription?.isActive) {
      fetchPlaylists();
    }
  }, [userId, subscription]);

  const isSubscribed = subscription?.isActive === true;

  // ✅ PLAY HANDLER (only one song at a time)
  const handlePlaySong = (songId) => {
    setCurrentSongId(songId);
  };

  // Toggle song selection
  const handleSongToggle = (songId) => {
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(selectedSongs.filter(id => id !== songId));
    } else {
      setSelectedSongs([...selectedSongs, songId]);
    }
  };

  // Create playlist
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!playlistName) return alert("Enter playlist name");

    try {
      const res = await API.post(`/playlists/create`, {
        userId,
        name: playlistName,
        description: playlistDescription,
        songs: selectedSongs,
      });

      alert(res.data.message);
      setPlaylists([...playlists, res.data.playlist]);
      setPlaylistName("");
      setPlaylistDescription("");
      setSelectedSongs([]);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create playlist");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Welcome User</h2>

      <button
        onClick={logout}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Logout
      </button>

      {/* Subscription status */}
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        {isSubscribed ? (
          <p style={{ color: "green", fontWeight: "bold" }}>
            ✓ You have an active subscription
          </p>
        ) : (
          <div>
            <p style={{ color: "orange" }}>You don't have a subscription yet</p>
            <button
              onClick={() => navigate("/subscriptions")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#1db954",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Buy Subscription
            </button>
          </div>
        )}
      </div>

      <h3>Songs</h3>

      {/* ✅ SONG CARD USAGE */}
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
            />
          ))
        )}
      </div>

      {/* Playlist section */}
      {isSubscribed && (
        <div
          style={{
            marginTop: "40px",
            maxWidth: "800px",
            margin: "40px auto",
            textAlign: "left",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>Create Playlist</h3>

          <form onSubmit={handleCreatePlaylist}>
            <input
              type="text"
              placeholder="Playlist Name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            />

            <input
              type="text"
              placeholder="Description (optional)"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
            />

            <h4>Select Songs</h4>

            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "15px",
              }}
            >
              {songs.map((song) => (
                <label key={song._id} style={{ display: "block", marginBottom: "8px" }}>
                  <input
                    type="checkbox"
                    checked={selectedSongs.includes(song._id)}
                    onChange={() => handleSongToggle(song._id)}
                    style={{ marginRight: "8px" }}
                  />
                  {song.title} – {song.artist}
                </label>
              ))}
            </div>

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#1db954",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Create Playlist
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
