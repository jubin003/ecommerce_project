import { useEffect, useState } from "react";
import API from "../api";

export default function AdminVinyls() {
  const [vinyls, setVinyls] = useState([]);
  const [songs, setSongs] = useState([]);
  const [form, setForm] = useState({
    songId: "",
    price: "",
    quantity: "",
    vinylImage: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchVinyls();
    fetchSongs();
  }, []);

  const fetchVinyls = async () => {
    try {
      const res = await API.get("/vinyls");
      setVinyls(res.data);
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

  const handleAdd = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("songId", form.songId);
    formData.append("price", form.price);
    formData.append("quantity", form.quantity);
    if (form.vinylImage) formData.append("vinylImage", form.vinylImage);

    try {
      await API.post("/vinyls/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Vinyl added successfully!");
      setForm({ songId: "", price: "", quantity: "", vinylImage: null });
      fetchVinyls();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding vinyl");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("price", form.price);
    formData.append("quantity", form.quantity);
    if (form.vinylImage) formData.append("vinylImage", form.vinylImage);

    try {
      await API.put(`/vinyls/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Vinyl updated successfully!");
      setForm({ songId: "", price: "", quantity: "", vinylImage: null });
      setEditMode(false);
      setEditId(null);
      fetchVinyls();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating vinyl");
    }
  };

  const handleEdit = (vinyl) => {
    setEditMode(true);
    setEditId(vinyl._id);
    setForm({
      songId: vinyl.song._id,
      price: vinyl.price,
      quantity: vinyl.quantity,
      vinylImage: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vinyl?")) return;
    try {
      await API.delete(`/vinyls/${id}`);
      alert("Vinyl deleted successfully!");
      fetchVinyls();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting vinyl");
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setForm({ songId: "", price: "", quantity: "", vinylImage: null });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Vinyls</h2>

      {/* Form */}
      <form
        onSubmit={editMode ? handleUpdate : handleAdd}
        style={{
          background: "#0f0f0f",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <h3>{editMode ? "Update Vinyl" : "Add New Vinyl"}</h3>

        {!editMode && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Select Song *</label>
            <select
              value={form.songId}
              onChange={(e) => setForm({ ...form, songId: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                background: "#1a1a1a",
                color: "white",
                border: "1px solid #333",
                borderRadius: "6px",
              }}
            >
              <option value="">-- Select a song --</option>
              {songs.map((song) => (
                <option key={song._id} value={song._id}>
                  {song.title} - {song.artist}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Price ($) *</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
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
          <label style={{ display: "block", marginBottom: "5px" }}>Quantity *</label>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
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
          <label style={{ display: "block", marginBottom: "5px" }}>
            Vinyl Image {editMode && "(Leave empty to keep current)"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, vinylImage: e.target.files[0] })}
            style={{ color: "white" }}
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
            {editMode ? "Update Vinyl" : "Add Vinyl"}
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

      {/* Vinyls List */}
      <h3>All Vinyls</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
        {vinyls.map((vinyl) => (
          <div
            key={vinyl._id}
            style={{
              background: "#1a1a1a",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #333",
            }}
          >
            <img
              src={
                vinyl.vinylImage?.startsWith("http")
                  ? vinyl.vinylImage
                  : `http://localhost:5001${vinyl.vinylImage}`
              }
              alt="Vinyl"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            <h4 style={{ margin: "10px 0 5px 0" }}>{vinyl.song?.title || "Unknown"}</h4>
            <p style={{ margin: "0 0 5px 0", color: "#b3b3b3" }}>
              {vinyl.song?.artist || "Unknown Artist"}
            </p>
            <p style={{ margin: "0 0 5px 0", color: "#1db954", fontSize: "18px", fontWeight: "bold" }}>
              ${vinyl.price}
            </p>
            <p style={{ margin: "0 0 15px 0", color: "#888" }}>Stock: {vinyl.quantity}</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleEdit(vinyl)}
                style={{
                  flex: 1,
                  padding: "8px",
                  background: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(vinyl._id)}
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