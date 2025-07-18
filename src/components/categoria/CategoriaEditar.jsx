import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Check, X } from "lucide-react";

const CategoriaEditar = () => {
  const [categorias, setCategorias] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [eliminandoId, setEliminandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [confirmar, setConfirmar] = useState(false);
  const [eliminada, setEliminada] = useState(false);

  useEffect(() => {
    const cargarCategorias = () => {
      axios
        .get("http://35.94.124.77:3000/categorias/listar")
        .then((res) => setCategorias(res.data.categorias || []))
        .catch(() => setCategorias([]));
    };
    cargarCategorias();
    window.addEventListener("focus", cargarCategorias);
    return () => window.removeEventListener("focus", cargarCategorias);
  }, []);

  const handleEditar = (id, nombrecat) => {
    setEditandoId(id);
    setNuevoNombre(nombrecat);
    setMensaje("");
  };

  const handleGuardar = (id) => {
    if (!nuevoNombre.trim()) return;
    axios
      .put(`http://35.94.124.77:3000/categorias/${id}`, {
        categoria: nuevoNombre,
      })
      .then(() => {
        const actualizadas = categorias.map((cat) =>
          cat.id === id ? { ...cat, nombrecat: nuevoNombre } : cat
        );
        setCategorias(actualizadas);
        setEditandoId(null);
        setMensaje("Categoría editada exitosamente");
        setTimeout(() => setMensaje(""), 2000);
      });
  };

  const handleEliminar = (id) => {
    setEliminandoId(id);
    setConfirmar(true);
    setEliminada(false);
  };

  const confirmarEliminar = () => {
    axios
      .delete(`http://35.94.124.77:3000/categorias/${eliminandoId}`)
      .then(() => {
        setCategorias(categorias.filter((cat) => cat.id !== eliminandoId));
        setConfirmar(false);
        setEliminada(true);
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Editar Categorías</h2>

      {mensaje && (
        <div className="text-green-600 font-semibold text-center mb-4">
          {mensaje}
        </div>
      )}

      {categorias.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay categorías registradas.
        </p>
      ) : (
        <div className="space-y-4">
          {categorias.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow border"
            >
              {editandoId === cat.id ? (
                <div className="flex flex-1 items-center gap-3">
                  <input
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                  />
                  <button
                    onClick={() => handleGuardar(cat.id)}
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-lg font-medium">{cat.nombrecat}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditar(cat.id, cat.nombrecat)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleEliminar(cat.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {confirmar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg mb-4">
              ¿Seguro que deseas eliminar esta categoría?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmar(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {eliminada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg mb-4">La categoría fue eliminada.</p>
            <button
              onClick={() => setEliminada(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriaEditar;
