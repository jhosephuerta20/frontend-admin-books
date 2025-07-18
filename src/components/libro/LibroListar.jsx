import React, { useEffect, useState } from "react";
import axios from "axios";

const LibroListar = () => {
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resLibros = await axios.get(
          "http://35.94.124.77:3000/libro/catalogo/completo"
        );
        setLibros(resLibros.data);

        const resCategorias = await axios.get(
          "http://35.94.124.77:3000/categorias/listar"
        );
        setCategorias(resCategorias.data.categorias);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();

    window.addEventListener("focus", cargarDatos);
    return () => window.removeEventListener("focus", cargarDatos);
  }, []);

  // Filtrado simple por nombre de categoría
  const librosFiltrados = categoriaFiltro
    ? libros.filter((libro) => libro.categoria === categoriaFiltro)
    : libros;

  return (
    <div className="max-w-6xl mx-auto py-10 px-5">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        Catálogo de Libros
      </h2>

      <div className="mb-6 flex items-center gap-4">
        <label
          htmlFor="categoriaFiltro"
          className="font-semibold text-gray-700"
        >
          Filtrar por categoría:
        </label>
        <select
          id="categoriaFiltro"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.nombrecat}>
              {cat.nombrecat}
            </option>
          ))}
        </select>
      </div>

      {librosFiltrados.length === 0 ? (
        <p className="text-gray-600">No hay libros registrados.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {librosFiltrados.map((libro) => (
            <div
              key={libro.id}
              className="bg-white rounded-lg border border-gray-200 shadow-md p-4 flex flex-col items-center text-center"
            >
              <div className="w-full h-52 flex items-center justify-center overflow-hidden mb-4">
                {libro.url_portada ? (
                  <img
                    src={libro.url_portada}
                    alt="Portada del libro"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">Sin imagen</span>
                )}
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                {libro.titulo}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                {libro.autor || (
                  <span className="text-gray-300">Sin autor</span>
                )}
              </p>
              <span className="text-blue-600 font-bold text-lg">
                S/{Number(libro.precio).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibroListar;
