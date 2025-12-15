import { useState } from "react";

export default function SongCard({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px", width: "200px" }}>
      <img src={song.coverArt || "https://via.placeholder.com/150"} alt={song.title} width="150" />
      <h4>{song.title}</h4>
      <p>{song.artist}</p>
              <audio
          controls
          src={`http://localhost:5001${song.url}`}
        />

    </div>
  );
}
