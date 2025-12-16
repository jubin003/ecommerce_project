import { useEffect, useState } from "react";
import API from "../api";

export default function AdminSongs() {
  const [songs, setSongs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    duration: "",
    file: null,
    coverArt: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch songs
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await API.get("/songs");
      setSongs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.file) return alert("Please select an audio file");

    const formData = new FormData();
    formData.append("file", form.file);
    if (form.coverArt) formData.append("coverArt", form.coverArt);
    formData.append("title", form.title);
    formData.append("artist", form.artist);
    formData.append("album", form.album);
    formData.append("duration", form.duration);

    try {
      await API.post("/songs/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Song added!");
      setForm({ title: "", artist: "", album: "", duration: "", file: null, coverArt: null });
      fetchSongs();
    } catch (err) {
      console.error("Error adding song:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error adding song");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;
    try {
      await API.delete(`/songs/${id}`);
      alert("Song deleted!");
      fetchSongs();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting song");
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setForm({ title: "", artist: "", album: "", duration: "", file: null, coverArt: null });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Songs</h2>

      {/* Form */}
      <form
        onSubmit={handleAdd}
        style={{
          background: "#0f0f0f",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <h3>{editMode ? "Update Song" : "Add New Song"}</h3>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Title *</label>
          <input
            type="text"
            placeholder="Song Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1a1a",
              color: "white",
              border: "1px solid #333",
              borderRadius: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Artist *</label>
          <input
            type="text"
            placeholder="Artist Name"
            value={form.artist}
            onChange={(e) => setForm({ ...form, artist: e.target.value })}
            required
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1a1a",
              color: "white",
              border: "1px solid #333",
              borderRadius: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Album</label>
          <input
            type="text"
            placeholder="Album Name (Optional)"
            value={form.album}
            onChange={(e) => setForm({ ...form, album: e.target.value })}
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1a1a",
              color: "white",
              border: "1px solid #333",
              borderRadius: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Duration (seconds)</label>
          <input
            type="number"
            placeholder="Duration in seconds"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1a1a",
              color: "white",
              border: "1px solid #333",
              borderRadius: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Audio File (MP3) *</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            required
            style={{ 
              color: "white",
              padding: "10px",
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "6px",
              width: "100%",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Cover Art</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, coverArt: e.target.files[0] })}
            style={{ 
              color: "white",
              padding: "10px",
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "6px",
              width: "100%",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              background: "#1db954",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {editMode ? "Update Song" : "Add Song"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                padding: "10px 20px",
                background: "#666",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Songs Grid */}
      <h3>All Songs</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {songs.map((song) => (
          <div
            key={song._id}
            style={{
              background: "#1a1a1a",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #333",
            }}
          >
            <img
              src={
                song.coverArt?.startsWith("http")
                  ? song.coverArt
                  : `http://localhost:5001${song.coverArt}`
              }
              alt={song.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            <h4 style={{ margin: "10px 0 5px 0" }}>{song.title}</h4>
            <p style={{ margin: "0 0 5px 0", color: "#b3b3b3" }}>
              {song.artist}
            </p>
            {song.album && (
              <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "14px" }}>
                Album: {song.album}
              </p>
            )}
            {song.duration > 0 && (
              <p style={{ margin: "0 0 15px 0", color: "#888", fontSize: "14px" }}>
                Duration: {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
              </p>
            )}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleDelete(song._id)}
                style={{
                  flex: 1,
                  padding: "8px",
                  background: "#d32f2f",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}