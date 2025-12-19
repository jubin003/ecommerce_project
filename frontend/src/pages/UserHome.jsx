import { useEffect, useState, useRef } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import SongCard from "../components/SongCard";
import Snowfall from "react-snowfall";

export default function UserHome() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [view, setView] = useState("browse");
  const audioRef = useRef(null);
  
  // Playlist creation form
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [playlistForm, setPlaylistForm] = useState({ name: "", description: "", songs: [] });

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

  // Fetch playlists
  useEffect(() => {
    if (view === "playlists") {
      fetchPlaylists();
    }
  }, [view, userId]);

  const fetchPlaylists = async () => {
    try {
      const res = await API.get(`/playlists/user/${userId}`);
      setPlaylists(res.data);
    } catch (err) {
      console.log(err);
    }
  };

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

  // Handle audio playback
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Play error:", err));
      }
    }
  }, [currentSong, isPlaying]);

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => console.log("Play error:", err));
        setIsPlaying(true);
      }
    }
  };

  const handleAddToCart = async (vinylId) => {
    try {
      await API.post("/cart/add", {
        userId,
        vinylId,
        quantity: 1,
      });
      alert("Added to cart!");
      const res = await API.get(`/cart/${userId}`);
      const count = res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartItemCount(count);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const toggleSongInPlaylist = (songId) => {
    if (playlistForm.songs.includes(songId)) {
      setPlaylistForm({
        ...playlistForm,
        songs: playlistForm.songs.filter(id => id !== songId)
      });
    } else {
      setPlaylistForm({
        ...playlistForm,
        songs: [...playlistForm.songs, songId]
      });
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      await API.post("/playlists/create", {
        userId,
        name: playlistForm.name,
        description: playlistForm.description,
        songs: playlistForm.songs,
      });
      alert("Playlist created successfully!");
      setPlaylistForm({ name: "", description: "", songs: [] });
      setShowCreatePlaylist(false);
      fetchPlaylists();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create playlist");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "white", paddingBottom: currentSong ? "100px" : "0" }}>
      <Snowfall color="#90D5FF"/>
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
          {/* View Toggle */}
          <button
            onClick={() => setView("browse")}
            style={{
              padding: "10px 20px",
              background: view === "browse" ? "#1db954" : "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            🎵 Browse
          </button>

          <button
            onClick={() => setView("playlists")}
            style={{
              padding: "10px 20px",
              background: view === "playlists" ? "#1db954" : "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            📝 My Playlists
          </button>

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
        {/* Browse Music View */}
        {view === "browse" && (
          <>
            <h3 style={{ marginBottom: "20px" }}>Browse Music & Vinyls</h3>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
              {songs.length === 0 ? (
                <p>No songs available</p>
              ) : (
                songs.map((song) => (
                  <SongCard
                    key={song._id}
                    song={song}
                    onPlay={() => handlePlaySong(song)}
                    isCurrentlyPlaying={currentSong?._id === song._id && isPlaying}
                    onAddToCart={handleAddToCart}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* Playlists View - Now available to all users */}
        {view === "playlists" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
              <h3 style={{ margin: 0 }}>My Playlists</h3>
              <button
                onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}
                style={{
                  padding: "12px 24px",
                  background: "#1db954",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {showCreatePlaylist ? "Cancel" : "+ Create Playlist"}
              </button>
            </div>

            {/* Create Playlist Form */}
            {showCreatePlaylist && (
              <div style={{ background: "#1a1a1a", padding: "25px", borderRadius: "12px", marginBottom: "30px" }}>
                <h4 style={{ marginBottom: "20px" }}>Create New Playlist</h4>
                <form onSubmit={handleCreatePlaylist}>
                  <input
                    type="text"
                    placeholder="Playlist Name"
                    value={playlistForm.name}
                    onChange={(e) => setPlaylistForm({ ...playlistForm, name: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginBottom: "15px",
                      background: "#0f0f0f",
                      color: "white",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={playlistForm.description}
                    onChange={(e) => setPlaylistForm({ ...playlistForm, description: e.target.value })}
                    rows="3"
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginBottom: "15px",
                      background: "#0f0f0f",
                      color: "white",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                  
                  <h5 style={{ marginBottom: "15px" }}>Select Songs:</h5>
                  <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
                    {songs.map((song) => (
                      <div
                        key={song._id}
                        onClick={() => toggleSongInPlaylist(song._id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          padding: "10px",
                          background: playlistForm.songs.includes(song._id) ? "#2a2a2a" : "#0f0f0f",
                          borderRadius: "8px",
                          marginBottom: "8px",
                          cursor: "pointer",
                          border: playlistForm.songs.includes(song._id) ? "2px solid #1db954" : "2px solid transparent",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={playlistForm.songs.includes(song._id)}
                          onChange={() => {}}
                          style={{ cursor: "pointer" }}
                        />
                        <img
                          src={song.coverArt.startsWith("http") ? song.coverArt : `http://localhost:5001${song.coverArt}`}
                          alt={song.title}
                          style={{ width: "40px", height: "40px", borderRadius: "4px" }}
                        />
                        <div>
                          <p style={{ margin: 0, fontWeight: "bold" }}>{song.title}</p>
                          <p style={{ margin: 0, fontSize: "14px", color: "#b3b3b3" }}>{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: "12px 24px",
                      background: "#1db954",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Create Playlist
                  </button>
                </form>
              </div>
            )}

            {/* Display Playlists */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
              {playlists.length === 0 ? (
                <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#888" }}>
                  No playlists yet. Create one to get started!
                </p>
              ) : (
                playlists.map((playlist) => (
                  <div
                    key={playlist._id}
                    style={{
                      background: "#1a1a1a",
                      padding: "20px",
                      borderRadius: "12px",
                      border: "1px solid #333",
                    }}
                  >
                    <h4 style={{ marginBottom: "10px" }}>{playlist.name}</h4>
                    {playlist.description && (
                      <p style={{ marginBottom: "15px", color: "#b3b3b3", fontSize: "14px" }}>
                        {playlist.description}
                      </p>
                    )}
                    <p style={{ marginBottom: "15px", color: "#888", fontSize: "14px" }}>
                      {playlist.songs?.length || 0} songs
                    </p>
                    
                    {/* Playlist Songs */}
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {playlist.songs?.map((song) => (
                        <div
                          key={song._id}
                          onClick={() => handlePlaySong(song)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px",
                            background: currentSong?._id === song._id ? "#2a2a2a" : "#0f0f0f",
                            borderRadius: "6px",
                            marginBottom: "8px",
                            cursor: "pointer",
                            border: currentSong?._id === song._id ? "2px solid #1db954" : "2px solid transparent",
                          }}
                        >
                          <img
                            src={song.coverArt?.startsWith("http") ? song.coverArt : `http://localhost:5001${song.coverArt}`}
                            alt={song.title}
                            style={{ width: "35px", height: "35px", borderRadius: "4px" }}
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold" }}>{song.title}</p>
                            <p style={{ margin: 0, fontSize: "11px", color: "#b3b3b3" }}>{song.artist}</p>
                          </div>
                          <span style={{ fontSize: "18px", color: currentSong?._id === song._id && isPlaying ? "#1db954" : "white" }}>
                            {currentSong?._id === song._id && isPlaying ? "⏸" : "▶"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Global Audio Player */}
      {currentSong && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#181818",
            padding: "15px 30px",
            borderTop: "2px solid #1db954",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            zIndex: 1000,
          }}
        >
          {/* Album Art */}
          <img
            src={currentSong.coverArt?.startsWith("http") ? currentSong.coverArt : `http://localhost:5001${currentSong.coverArt}`}
            alt={currentSong.title}
            style={{ width: "60px", height: "60px", borderRadius: "6px", objectFit: "cover" }}
          />

          {/* Song Info */}
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: "0 0 5px 0", color: "white", fontSize: "16px" }}>{currentSong.title}</h4>
            <p style={{ margin: 0, color: "#b3b3b3", fontSize: "14px" }}>{currentSong.artist}</p>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "#1db954",
              border: "none",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          {/* Audio Element with Controls */}
          <audio
            ref={audioRef}
            src={`http://localhost:5001${currentSong.url}`}
            controls
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            style={{ flex: 1, maxWidth: "400px" }}
          />

          {/* Close Button */}
          <button
            onClick={() => {
              setCurrentSong(null);
              setIsPlaying(false);
            }}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "#333",
              border: "none",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}