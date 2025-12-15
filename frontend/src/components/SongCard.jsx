import { useState, useRef, useEffect } from "react";

export default function SongCard({ song, onPlay, isCurrentlyPlaying }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

    console.log("AUDIO URL:", `http://localhost:5001${song.url}`);

  useEffect(() => {
    if (audioRef.current) {
      if (isCurrentlyPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isCurrentlyPlaying]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        onPlay(song._id);
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div
    
      style={{
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "15px",
        margin: "10px",
        width: "220px",
        background: "#1a1a1a",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Cover Art Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "180px",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "12px",
          background: "#2a2a2a",
        }}
      >
        <img
          src={song.coverArt || "https://via.placeholder.com/220x180?text=No+Cover"}
          alt={song.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        
        {/* Play/Pause Button Overlay */}
        <div
          onClick={handlePlayPause}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(29, 185, 84, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(29, 185, 84, 1)";
            e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(29, 185, 84, 0.9)";
            e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "24px",
              marginLeft: isPlaying ? "0" : "3px",
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </span>
        </div>
      </div>

      {/* Song Info */}
      <h4
        style={{
          margin: "8px 0",
          fontSize: "16px",
          fontWeight: "bold",
          color: "white",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {song.title}
      </h4>
      <p
        style={{
          margin: "4px 0",
          fontSize: "14px",
          color: "#b3b3b3",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {song.artist}
      </p>
      {song.album && (
        <p
          style={{
            margin: "4px 0",
            fontSize: "12px",
            color: "#888",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {song.album}
        </p>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={`http://localhost:5001${song.url}`}
        onEnded={() => setIsPlaying(false)}
        style={{ display: "none" }}
      />
    </div>
  );
}