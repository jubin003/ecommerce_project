import { useEffect, useRef, useState } from "react";
import API, { BASE_URL } from "../api";

export default function Songs() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await API.get("/songs");
      setSongs(res.data);
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [currentSong]);

  return (
    <div>
      <h2>Songs</h2>

      <div className="song-grid">
        {songs.map((song) => (
          <div key={song._id} className="song-card">
            <h4>{song.title}</h4>

            <button onClick={() => setCurrentSong(song)}>
              ▶ Play
            </button>
          </div>
        ))}
      </div>

      {currentSong && (
        <div className="player">
          <p>Now Playing: {currentSong.title}</p>

          <audio
            ref={audioRef}
            controls
            src={`${BASE_URL}${currentSong.url}`}
          />
        </div>
      )}
    </div>
  );
}
