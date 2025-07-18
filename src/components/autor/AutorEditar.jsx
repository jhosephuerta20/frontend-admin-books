import React, { useEffect, useState } from "react";
import axios from "axios";

const letras = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const AutorEditar = () => {
  const [autores, setAutores] = useState([]);
  const [filtroLetra, setFiltroLetra] = useState("");
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", imagenUrl: "" });
  const [mensaje, setMensaje] = useState("");
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

  useEffect(() => {
    axios
      .get("http://35.94.124.77:3000/autor/listar")
      .then((res) => setAutores(res.data))
      .catch(() => setAutores([]));
  }, []);

  const autoresFiltrados = filtroLetra
    ? autores.filter(
        (a) => a.nombre && a.nombre[0]?.toUpperCase() === filtroLetra
      )
    : autores;

  const seleccionarEditar = (idx) => {
    setEditando(idx);
    setForm(autores[idx]);
    setMensaje("");
  };

  const cancelar = () => {
    setEditando(null);
    setForm({ nombre: "", imagenUrl: "" });
    setMensaje("");
  };

  const guardarCambios = () => {
    if (!form.nombre.trim()) {
      setMensaje("El nombre es obligatorio");
      return;
    }
    axios
      .put(`http://35.94.124.77:3000/autores/${autores[editando]?.id}`, form)
      .then((res) => {
        const actualizados = [...autores];
        actualizados[editando] = res.data;
        setAutores(actualizados);
        setMensaje("Autor editado exitosamente");
        setEditando(null);
      });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const confirmarEliminarAutor = (idx) => {
    setConfirmarEliminar(idx);
    setMensaje("");
  };

  const eliminarAutor = () => {
    axios
      .delete(
        `http://35.94.124.77:3000/autores/${autores[confirmarEliminar]?.id}`
      )
      .then(() => {
        const actualizados = [...autores];
        actualizados.splice(confirmarEliminar, 1);
        setAutores(actualizados);
        setMensaje("Autor eliminado exitosamente");
        setConfirmarEliminar(null);
      });
  };

  const cancelarEliminar = () => setConfirmarEliminar(null);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        position: "relative",
        display: "flex",
      }}
    >
      {/* Columna filtro alfabético */}
      <div
        style={{
          background: "#C6E6FB",
          padding: "18px 10px",
          borderRadius: "12px",
          marginRight: "32px",
          height: "fit-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {letras.map((letra) => (
          <label
            key={letra}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "6px",
              width: "32px",
              justifyContent: "center",
            }}
          >
            <input
              type="checkbox"
              checked={filtroLetra === letra}
              onChange={() =>
                setFiltroLetra(filtroLetra === letra ? "" : letra)
              }
              style={{
                width: "16px",
                height: "16px",
                marginRight: "4px",
                background: "#fff",
                border: "1px solid #111",
                borderRadius: "3px",
                accentColor: "#1746A2",
              }}
            />
            <span
              style={{ fontWeight: "bold", fontSize: "15px", color: "#111" }}
            >
              {letra}
            </span>
          </label>
        ))}
      </div>
      {/* Contenido principal autores */}
      <div style={{ flex: 1 }}>
        <h2>Editar/Eliminar Autor</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "32px",
            justifyContent: "flex-start",
            marginTop: "24px",
          }}
        >
          {autoresFiltrados.map((autor, idx) => (
            <div
              key={idx}
              style={{
                width: "180px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                borderRadius: "8px",
                background: "#fff",
                padding: "12px 8px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  background: "#F4F6F8",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  marginBottom: "12px",
                }}
              >
                {autor.imagenUrl ? (
                  <img
                    src={autor.imagenUrl}
                    alt=""
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "-"
                )}
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
              >
                {autor.nombre}
              </div>
              <button
                style={{
                  background: "#1746A2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 10px",
                  fontWeight: "bold",
                  fontSize: "13px",
                  marginTop: "8px",
                  cursor: "pointer",
                }}
                onClick={() => seleccionarEditar(idx)}
              >
                Editar
              </button>
              <button
                style={{
                  background: "#D7263D",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 10px",
                  fontWeight: "bold",
                  fontSize: "13px",
                  marginTop: "8px",
                  cursor: "pointer",
                }}
                onClick={() => confirmarEliminarAutor(idx)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
      {editando !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "32px 24px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              minWidth: "320px",
              textAlign: "center",
            }}
          >
            <h3>Editar Autor</h3>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              style={{ marginBottom: "8px", width: "90%", padding: "8px" }}
            />
            <input
              name="imagenUrl"
              value={form.imagenUrl}
              onChange={handleChange}
              placeholder="URL de imagen"
              style={{ marginBottom: "8px", width: "90%", padding: "8px" }}
            />
            <div
              style={{
                width: "100%",
                height: "120px",
                background: "#F4F6F8",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#555",
                marginBottom: "8px",
                fontWeight: "500",
                fontSize: "18px",
              }}
            >
              {form.imagenUrl ? (
                <img
                  src={form.imagenUrl}
                  alt="Vista previa"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                "Vista previa"
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginTop: "12px",
              }}
            >
              <button
                onClick={cancelar}
                style={{
                  background: "#B0B0B0",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 24px",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={guardarCambios}
                style={{
                  background: "#1746A2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 24px",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmarEliminar !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "32px 24px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              minWidth: "320px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "24px" }}>
              ¿Seguro que desea eliminar el autor?
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "16px" }}
            >
              <button
                onClick={cancelarEliminar}
                style={{
                  background: "#B0B0B0",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 24px",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={eliminarAutor}
                style={{
                  background: "#D7263D",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 24px",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
      {mensaje && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "32px 24px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              minWidth: "320px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "24px" }}>{mensaje}</p>
            <button
              onClick={() => setMensaje("")}
              style={{
                background: "#1746A2",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "8px 24px",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutorEditar;
