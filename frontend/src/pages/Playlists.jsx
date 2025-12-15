import { useEffect, useState } from "react";
import API from "../api";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // Fetch all playlists for the user
  useEffect(() => {
    fetchPlaylists();
    fetchSongs();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const res = await API.get(`/playlists/user/${userId}`);
      setPlaylists(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSongs = async () => {
    try {
      const res = await API.get("/songs");
      setSongs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSongSelect = (songId) => {
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(selectedSongs.filter(id => id !== songId));
    } else {
      setSelectedSongs([...selectedSongs, songId]);
    }
  };

 const handleCreate = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/playlists/create", {
      name,
      description,
      songs: selectedSongs,
    });
    alert(res.data.message);
    fetchPlaylists();
  } catch (err) {
    alert(err.response?.data?.message);
  }
};


  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>My Playlists</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Playlist Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        /><br/><br/>
        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        /><br/><br/>

        <h4>Select Songs</h4>
        {songs.map(song => (
          <div key={song._id}>
            <label>
              <input
                type="checkbox"
                value={song._id}
                checked={selectedSongs.includes(song._id)}
                onChange={() => handleSongSelect(song._id)}
              />
              {song.title} by {song.artist}
            </label>
          </div>
        ))}

        <br/>
        <button type="submit">Create Playlist</button>
      </form>

      <h3>Your Playlists</h3>
      {playlists.length === 0 ? (
        <p>No playlists yet.</p>
      ) : (
        playlists.map(pl => (
          <div key={pl._id} style={{ marginBottom: "15px" }}>
            <strong>{pl.name}</strong>: {pl.description}
            <div>Songs: {pl.songs.map(s => s.title).join(", ")}</div>
          </div>
        ))
      )}
    </div>
  );
}
