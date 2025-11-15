import { useEffect, useState } from "react";
import API from "../api";

export default function Songs() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await API.get("/songs");
        setSongs(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSongs();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>All Songs</h2>
      {songs.length === 0 ? (
        <p>No songs available.</p>
      ) : (
        songs.map(song => (
          <div key={song._id} style={{ marginBottom: "15px" }}>
            <strong>{song.title}</strong> by {song.artist} | Album: {song.album}{" "}
            <button onClick={() => setCurrentSong(song)}>Play</button>
          </div>
        ))
      )}

      {currentSong && (
        <div style={{ marginTop: "30px" }}>
          <h3>Now Playing: {currentSong.title} by {currentSong.artist}</h3>
          <audio controls src={currentSong.url} autoPlay>
            Your browser does not support the audio element.
          </audio>
          <br/>
          <button onClick={() => setCurrentSong(null)}>Stop</button>
        </div>
      )}
    </div>
  );
}
