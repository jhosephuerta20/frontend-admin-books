import React, { useEffect, useState } from "react";
import axios from "axios";

const LibroEditar = () => {
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    autor: "",
    precio: "",
    categoria: "",
    imagenUrl: "",
    isbn: "",
    urlLibro: "",
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios
      .get("http://35.94.124.77:3000/categorias")
      .then((res) => setCategorias(res.data))
      .catch(() => setCategorias([]));
    axios
      .get("http://35.94.124.77:3000/libros")
      .then((res) => setLibros(res.data))
      .catch(() => setLibros([]));
  }, []);

  const librosFiltrados = filtroCategoria
    ? libros.filter(
        (l) =>
          l.categoria ===
          categorias.find((c) => c.id === Number(filtroCategoria))?.nombre
      )
    : libros;

  const seleccionarLibro = (idx) => {
    setEditando(idx);
    setForm({
      nombre: libros[idx].nombre || "",
      autor: libros[idx].autor || "",
      precio: libros[idx].precio || "",
      categoria: libros[idx].categoria || "",
      imagenUrl: libros[idx].imagenUrl || "",
      isbn: libros[idx].isbn || "",
      urlLibro: libros[idx].urlLibro || "",
    });
    setMensaje("");
  };

  const cancelar = () => {
    setEditando(null);
    setForm({
      nombre: "",
      autor: "",
      precio: "",
      categoria: "",
      imagenUrl: "",
      isbn: "",
      urlLibro: "",
    });
    setMensaje("");
  };

  const guardarCambios = () => {
    const libroEditado = form;
    axios
      .put(`http://35.94.124.77:3000/libros/${editando}`, libroEditado)
      .then((res) => {
        const actualizados = [...libros];
        actualizados[editando] = res.data;
        setLibros(actualizados);
        setMensaje("Libro editado exitosamente");
        setEditando(null);
      });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
      <h2>Editar Libro</h2>
      <div style={{ marginBottom: "16px" }}>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #B0B0B0",
          }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "32px",
          justifyContent: "flex-start",
          marginTop: "24px",
        }}
      >
        {librosFiltrados.map((libro, idx) => (
          <div
            key={idx}
            style={{
              width: "180px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "150px",
                height: "200px",
                background: "#F4F6F8",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                marginBottom: "12px",
              }}
            >
              {libro.imagenUrl ? (
                <img
                  src={libro.imagenUrl}
                  alt=""
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
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
              {libro.nombre}
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "15px",
                color: "#444",
                marginBottom: "8px",
              }}
            >
              {libro.autor || <span style={{ color: "#bbb" }}>Sin autor</span>}
            </div>
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
                color: "#111",
              }}
            >
              S/{Number(libro.precio).toFixed(2)}
            </div>
            <button
              style={{
                marginTop: "10px",
                background: "#1746A2",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "4px 10px",
                fontWeight: "bold",
                fontSize: "13px",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                seleccionarLibro(idx);
              }}
            >
              Editar
            </button>
          </div>
        ))}
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
            <h3>Editar Libro</h3>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              style={{ marginBottom: "8px", width: "90%", padding: "8px" }}
            />
            <input
              name="autor"
              value={form.autor}
              onChange={handleChange}
              placeholder="Autor"
              style={{ marginBottom: "8px", width: "90%", padding: "8px" }}
            />
            <input
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              placeholder="ISBN"
              style={{ marginBottom: "8px", width: "90%", padding: "8px" }}
            />
            <input
              name="urlLibro"
              value={form.urlLibro}
              onChange={handleChange}
              placeholder="URL libro (PDF)"
              style={{ marginBottom: "8px", width: "90%", padding: "8px" }}
            />
            <input
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="Precio"
              type="number"
              style={{ marginBottom: "8px", width: "90%", padding: "8px" }}
            />
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              style={{ marginBottom: "8px", width: "90%", padding: "8px" }}
            >
              <option value="">Seleccione categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            <input
              name="imagenUrl"
              value={form.imagenUrl}
              onChange={handleChange}
              placeholder="URL de imagen"
              style={{ marginBottom: "8px", width: "90%", padding: "8px" }}
            />
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

export default LibroEditar;
