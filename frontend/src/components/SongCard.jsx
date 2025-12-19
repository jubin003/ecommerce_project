import { useState, useRef, useEffect } from "react";
import API from "../api";

export default function SongCard({ song, onPlay, isCurrentlyPlaying, onAddToCart }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [vinyl, setVinyl] = useState(null);
  const [vinylLoading, setVinylLoading] = useState(true);
  const [vinylError, setVinylError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Fetch vinyl info for this song
    const fetchVinyl = async () => {
      try {
        setVinylLoading(true);
        setVinylError(null);
        const res = await API.get(`/vinyls/song/${song._id}`);
        console.log(`Vinyl data for ${song.title}:`, res.data);
        setVinyl(res.data);
      } catch (err) {
        // Vinyl not available for this song
        console.log(`No vinyl found for song ${song.title}:`, err.response?.status);
        setVinylError(err.response?.status === 404 ? "No vinyl available" : "Error loading vinyl");
        setVinyl(null);
      } finally {
        setVinylLoading(false);
      }
    };
    fetchVinyl();
  }, [song._id, song.title]);

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

  const handleAddToCart = () => {
    if (vinyl && onAddToCart) {
      console.log("Adding to cart:", vinyl);
      onAddToCart(vinyl._id);
    }
  };

  const hasVinylAvailable = vinyl && vinyl.quantity > 0;

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
        position: "relative",
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
      {/* Vinyl Badge */}
      {hasVinylAvailable && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#1db954",
            color: "white",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "10px",
            fontWeight: "bold",
            zIndex: 10,
          }}
        >
          🎵 VINYL
        </div>
      )}

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
          src={
            song.coverArt.startsWith("http")
              ? song.coverArt
              : `http://localhost:5001${song.coverArt}`
          }
          alt={song.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
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

      {/* Debug Info (Remove in production) */}
      {vinylLoading && (
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #333" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Loading vinyl info...</p>
        </div>
      )}

      {vinylError && !vinylLoading && (
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #333" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{vinylError}</p>
        </div>
      )}

      {/* Vinyl Purchase Section */}
      {hasVinylAvailable && (
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #333" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: "14px", color: "#1db954", fontWeight: "bold" }}>
                ${vinyl.price}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>
                {vinyl.quantity} in stock
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              style={{
                padding: "8px 12px",
                background: "#1db954",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#1ed760";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#1db954";
                e.target.style.transform = "scale(1)";
              }}
            >
              🛒 Add
            </button>
          </div>
        </div>
      )}

      {/* Show message if vinyl exists but out of stock */}
      {vinyl && vinyl.quantity === 0 && (
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #333" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#d32f2f", textAlign: "center" }}>
            Out of Stock
          </p>
        </div>
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