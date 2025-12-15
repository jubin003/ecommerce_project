import { useRef, useEffect } from "react";

export default function GlobalPlayer({ currentSong, onEnded }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentSong]);

  if (!currentSong) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#181818",
      padding: "15px",
      borderTop: "1px solid #333",
      display: "flex",
      alignItems: "center",
      gap: "20px",
      zIndex: 1000
    }}>
      <img 
        src={currentSong.coverArt} 
        alt={currentSong.title}
        style={{ width: "60px", height: "60px", borderRadius: "4px" }}
      />
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, color: "white" }}>{currentSong.title}</h4>
        <p style={{ margin: 0, color: "#b3b3b3", fontSize: "14px" }}>{currentSong.artist}</p>
      </div>
      <audio
        ref={audioRef}
        controls
        src={`http://localhost:5001${currentSong.url}`}
        onEnded={onEnded}
        style={{ width: "400px" }}
      />
    </div>
  );
}