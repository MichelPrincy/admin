import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [items, setItems] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // CHARGER LISTE ITEMS
  const fetchItems = async () => {
    const res = await fetch(`${API}/items`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // AJOUTER ITEM
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);

    const form = new FormData();
    form.append("image", image);
    form.append("description", description);

    await fetch(`${API}/items`, {
      method: "POST",
      body: form,
    });

    setImage(null);
    setDescription("");
    setPreview(null);
    fetchItems();
    setLoading(false);
  };

  // SUPPRIMER ITEM
  const handleDelete = async (id) => {
    await fetch(`${API}/items/${id}`, { method: "DELETE" });
    fetchItems();
  };

  // MODIFIER DESCRIPTION
  const handleUpdate = async (id) => {
    const newDesc = prompt("Nouvelle description :");
    if (!newDesc) return;

    await fetch(`${API}/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: newDesc }),
    });

    fetchItems();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        background: "#f6f6f6",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 30,
          }}
        >
          📷 Gestion d’Images – Ashna DagoTour
        </h1>

        {/* FORMULAIRE D'AJOUT */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: 40,
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 15 }}>Ajouter un nouvel item</h2>

          {/* FILE INPUT */}
          <div style={{ marginBottom: 15 }}>
            <input
              type="file"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
              required
              style={{
                border: "1px solid #ccc",
                padding: 10,
                borderRadius: 8,
                width: "96%",
              }}
            />
          </div>

          {/* PREVIEW IMAGE */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                width: 120,
                borderRadius: 10,
                marginBottom: 15,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            />
          )}

          {/* DESCRIPTION */}
          <input
            type="text"
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
              width: "95%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #ccc",
              marginBottom: 15,
              fontSize: 16,
            }}
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: loading ? "#888" : "#000",
              color: "white",
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Chargement..." : "Ajouter"}
          </button>
        </form>

        {/* LISTE DES ITEMS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
            justifyItems: "center",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                background: "white",
                borderRadius: 12,
                padding: 15,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxWidth: 260,
              }}
            >
              <img
                src={item.image_url}
                alt=""
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 10,
                  marginBottom: 15,
                }}
              />

              <p style={{ fontWeight: 500, marginBottom: 5 }}>{item.description}</p>
              <small style={{ color: "#666", marginBottom: 15 }}>
                {new Date(item.created_at).toLocaleString()}
              </small>

              <div style={{ display: "flex", gap: 10, width: "100%" }}>
                <button
                  onClick={() => handleUpdate(item.id)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    background: "#0A7AFF",
                    color: "white",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Modifier
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    background: "#FF3B30",
                    color: "white",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
