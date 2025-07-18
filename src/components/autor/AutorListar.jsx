import React, { useEffect, useState } from "react";

const AutorListar = () => {
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAutores = async () => {
      try {
        const response = await fetch("http://35.94.124.77:3000/autor/listar");
        const data = await response.json();
        setAutores(data.autores || []);
      } catch (error) {
        console.error("Error al cargar autores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAutores();

    const handleFocus = () => {
      fetchAutores();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        Lista de Autores
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 text-xl">Cargando autores...</p>
      ) : autores.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">
          No hay autores registrados.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {autores.map((autor) => (
            <div
              key={autor.id}
              className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition transform duration-300 ease-in-out hover:scale-105"
            >
              {/* Imagen con borde y sombra */}
              <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center overflow-hidden rounded-full border-4 border-gray-200 shadow-sm">
                <img
                  src={
                    autor.url_foto ??
                    "https://via.placeholder.com/150?text=Sin+Foto"
                  }
                  alt={autor.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Nombre del autor */}
              <h3 className="text-xl font-semibold text-gray-700 text-center mb-2 px-2">
                {autor.nombre}
              </h3>
              {/* Opcional: Aquí puedes agregar más detalles */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutorListar;
