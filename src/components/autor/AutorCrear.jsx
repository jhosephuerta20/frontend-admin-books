import React, { useState } from "react";
import axios from "axios";

const AutorCrear = () => {
  const [nombre, setNombre] = useState("");
  const [url_foto, setImagenUrl] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setMensaje("El nombre es obligatorio");
      return;
    }
    const nuevoAutor = { nombre, url_foto };
    axios
      .post("http://35.94.124.77:3000/autor/registrar", nuevoAutor)
      .then((res) => {
        setNombre("");
        setImagenUrl("");
        setMensaje("Autor creado exitosamente");
      });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Registrar Autor</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        <input
          type="text"
          placeholder="Nombre del autor"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #B0B0B0",
          }}
        />
        <input
          type="text"
          placeholder="URL de la imagen"
          value={url_foto}
          onChange={(e) => setImagenUrl(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #B0B0B0",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "160px",
            background: "#F4F6F8",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#555",
            marginBottom: "8px",
            fontWeight: "500",
            fontSize: "18px",
          }}
        >
          {url_foto ? (
            <img
              src={url_foto}
              alt="Vista previa"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            "Vista previa"
          )}
        </div>
        <button
          type="submit"
          style={{
            background: "#1746A2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "10px 0",
            fontWeight: "bold",
            fontSize: "16px",
            letterSpacing: "1px",
          }}
        >
          Registrar Autor
        </button>
      </form>
      {mensaje && (
        <div
          style={{ marginTop: "16px", color: "#1746A2", fontWeight: "bold" }}
        >
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default AutorCrear;
