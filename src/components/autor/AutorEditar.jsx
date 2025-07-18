import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Edit3,
  Trash2,
  Save,
  XCircle,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const letras = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const AutorEditar = () => {
  const [autores, setAutores] = useState([]);
  const [filtroLetra, setFiltroLetra] = useState("");
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", url_foto: "" });
  const [mensaje, setMensaje] = useState("");
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

  useEffect(() => {
    axios
      .get("http://35.94.124.77:3000/autor/listar")
      .then((res) => setAutores(res.data.autores))
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
    setForm({ nombre: "", url_foto: "" });
    setMensaje("");
  };

  const guardarCambios = () => {
    if (!form.nombre.trim()) {
      setMensaje("El nombre es obligatorio");
      return;
    }

    axios
      .put(
        `http://35.94.124.77:3000/autor/actualizar/${autores[editando]?.id}`,
        form
      )
      .then((res) => {
        const actualizados = [...autores];
        actualizados[editando] = res.data;
        setAutores(actualizados);
        setMensaje("✅ Autor editado exitosamente");
        setEditando(null);
      });
  };

  const confirmarEliminarAutor = (idx) => {
    setConfirmarEliminar(idx);
    setMensaje("");
  };

  const eliminarAutor = () => {
    axios
      .delete(
        `http://35.94.124.77:3000/autor/eliminar/${autores[confirmarEliminar]?.id}`
      )
      .then(() => {
        const actualizados = [...autores];
        actualizados.splice(confirmarEliminar, 1);
        setAutores(actualizados);
        setMensaje("🗑️ Autor eliminado exitosamente");
        setConfirmarEliminar(null);
      });
  };

  const cancelarEliminar = () => setConfirmarEliminar(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar / Eliminar Autor</h1>

      <div className="flex gap-1 flex-wrap mb-4">
        {letras.map((letra) => (
          <button
            key={letra}
            onClick={() => setFiltroLetra(letra)}
            className={`px-2 py-1 text-sm rounded ${
              filtroLetra === letra
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {letra}
          </button>
        ))}
        <button
          onClick={() => setFiltroLetra("")}
          className="px-2 py-1 text-sm bg-red-500 text-white rounded ml-2"
        >
          Limpiar
        </button>
      </div>

      {mensaje && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
          {mensaje}
        </div>
      )}

      <div className="grid gap-4">
        {autoresFiltrados.map((autor, idx) => (
          <div
            key={autor.id}
            className="bg-white p-4 rounded-lg shadow border flex items-center gap-4"
          >
            <img
              src={autor.url_foto}
              alt="Foto del autor"
              className="w-16 h-16 rounded-full object-cover border"
            />

            {editando === idx ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del autor"
                  className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-blue-400"
                />
                <input
                  type="text"
                  name="url_foto"
                  value={form.url_foto}
                  onChange={handleChange}
                  placeholder="URL de la foto"
                  className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-blue-400"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={guardarCambios}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Save size={16} /> Guardar
                  </button>
                  <button
                    onClick={cancelar}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    <XCircle size={16} /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{autor.nombre}</h2>
                  {/* <p className="text-sm text-gray-600">{autor.url_foto}</p> */}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => seleccionarEditar(idx)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button
                    onClick={() => confirmarEliminarAutor(idx)}
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

      {confirmarEliminar !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-red-600 mb-4">
              <AlertTriangle size={20} /> Confirmar eliminación
            </h2>
            <p>¿Estás seguro de que deseas eliminar este autor?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={eliminarAutor}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sí, eliminar
              </button>
              <button
                onClick={cancelarEliminar}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutorEditar;
