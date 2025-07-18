import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, XCircle, CheckCircle } from "lucide-react";

const LibroEliminar = () => {
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCat, setFiltroCat] = useState("");
  const [confirmarIdx, setConfirmarIdx] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [librosRes, catsRes] = await Promise.all([
          axios.get("http://35.94.124.77:3000/libro/listar"),
          axios.get("http://35.94.124.77:3000/categorias/listar"),
        ]);

        const librosData = await Promise.all(
          librosRes.data.libros.map(async (libro) => {
            let autorNombre = "Autor desconocido";
            if (libro.id_autor) {
              try {
                const autorRes = await axios.get(
                  `http://35.94.124.77:3000/autor/obtener/individual/${libro.id_autor}`
                );
                autorNombre = autorRes.data.nombre;
              } catch {
                autorNombre = "Error al cargar autor";
              }
            }
            return { ...libro, autorNombre };
          })
        );

        setLibros(librosData);
        setCategorias(catsRes.data.categorias || []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchData();
  }, []);

  const librosFiltrados = filtroCat
    ? libros.filter((l) => l.id_categoria === Number(filtroCat))
    : libros;

  const abrirConfirmar = (idx) => {
    setConfirmarIdx(idx);
    setMensaje("");
  };

  const cerrarConfirm = () => setConfirmarIdx(null);

  const eliminarLibro = async () => {
    const id = libros[confirmarIdx].id;
    try {
      await axios.delete(`http://35.94.124.77:3000/libro/${id}`);
      const nuevos = libros.filter((_, i) => i !== confirmarIdx);
      setLibros(nuevos);
      setMensaje("Libro eliminado correctamente 🗑️");
      setConfirmarIdx(null);
    } catch (err) {
      console.error("Error al eliminar libro:", err);
      alert("Hubo un error al eliminar el libro.");
    }
  };

  const formatearFecha = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Eliminar Libros</h2>

      {mensaje && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded flex items-center gap-2">
          <CheckCircle size={20} /> <span>{mensaje}</span>
        </div>
      )}

      <div className="mb-6">
        <select
          className="px-4 py-2 border rounded shadow focus:outline-none focus:ring focus:border-blue-400"
          value={filtroCat}
          onChange={(e) => setFiltroCat(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombrecat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {librosFiltrados.map((libro, idx) => (
          <div
            key={libro.id}
            className="bg-white shadow rounded-lg overflow-hidden flex flex-col"
          >
            <img
              src={libro.url_portada}
              alt={libro.titulo}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg mb-1">{libro.titulo}</h3>
              <p className="text-sm text-gray-600 mb-1">{libro.descripcion}</p>
              <p className="text-sm text-gray-500 mb-1">
                Autor:{" "}
                <span className="text-blue-700">{libro.autorNombre}</span>
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Categoría:{" "}
                {categorias.find((c) => c.id === libro.id_categoria)
                  ?.nombrecat || "Sin categoría"}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Publicado: {formatearFecha(libro.created_at)}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-indigo-600">
                  S/ {Number(libro.precio).toFixed(2)}
                </span>
                <button
                  onClick={() => abrirConfirmar(idx)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmarIdx !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={24} className="text-red-600" />
              <h4 className="text-lg font-medium">Confirmar eliminación</h4>
            </div>
            <p className="mb-6">
              ¿Seguro que deseas eliminar el libro{" "}
              <strong>{libros[confirmarIdx]?.titulo}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cerrarConfirm}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarLibro}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibroEliminar;
