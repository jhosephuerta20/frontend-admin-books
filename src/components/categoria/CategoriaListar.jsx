import React, { useEffect, useState } from "react";
import axios from "axios";
import { FolderKanban } from "lucide-react";

const CategoriaListar = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    axios
      .get("http://35.94.124.77:3000/categorias/listar")
      .then((res) => setCategorias(res.data.categorias || []))
      .catch(() => setCategorias([]));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-3xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-8 border-b-2 border-blue-600 pb-2">
        Categorías disponibles
      </h2>

      {categorias.length === 0 ? (
        <p className="text-center text-gray-500 text-xl mt-4">
          No hay categorías registradas.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categorias.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-4 bg-white p-4 shadow hover:shadow-lg rounded-xl border border-gray-200 hover:border-blue-500 transition duration-200"
            >
              <div className="bg-blue-100 p-3 rounded-full shadow-sm">
                <FolderKanban size={28} className="text-blue-600" />
              </div>
              <span className="text-lg font-semibold text-gray-800">
                {cat.nombrecat}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriaListar;
