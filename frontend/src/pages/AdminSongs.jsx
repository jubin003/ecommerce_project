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
    formData.append("file", form.file); // audio
    if (form.coverArt) formData.append("coverArt", form.coverArt); // optional image
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

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Manage Songs</h2>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Artist"
          value={form.artist}
          onChange={e => setForm({ ...form, artist: e.target.value })}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Album"
          value={form.album}
          onChange={e => setForm({ ...form, album: e.target.value })}
        />
        <br /><br />
        <input
          type="text"
          placeholder="Duration"
          value={form.duration}
          onChange={e => setForm({ ...form, duration: e.target.value })}
        />
        <br /><br />
        <input
          type="file"
          accept="audio/*"
          onChange={e => setForm({ ...form, file: e.target.files[0] })}
          required
        />
        <br /><br />
        <input
          type="file"
          accept="image/*"
          onChange={e => setForm({ ...form, coverArt: e.target.files[0] })}
        />
        <br /><br />
        <button type="submit">Add Song</button>
      </form>

      <h3>All Songs</h3>
      <ul>
        {songs.map(song => (
          <li key={song._id}>
            {song.title} - {song.artist}
            <button onClick={() => handleDelete(song._id)} style={{ marginLeft: "10px" }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
