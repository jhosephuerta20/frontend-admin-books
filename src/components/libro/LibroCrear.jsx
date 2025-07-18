import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Save, UploadCloud, FilePlus, Image } from "lucide-react";

const LibroCrear = () => {
  const [imagenUrl, setImagenUrl] = useState("");
  const [nombre, setNombre] = useState("");
  const [autor, setAutor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [isbn, setIsbn] = useState("");
  const [urlLibro, setUrlLibro] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [autores, setAutores] = useState([]);
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    const cargarDatos = () => {
      axios
        .get("http://35.94.124.77:3000/categorias/listar")
        .then((res) => setCategorias(res.data.categorias || []))
        .catch(() => setCategorias([]));
      axios
        .get("http://35.94.124.77:3000/autor/listar")
        .then((res) => setAutores(res.data.autores || []))
        .catch(() => setAutores([]));
    };

    cargarDatos();
    window.addEventListener("focus", cargarDatos);
    return () => window.removeEventListener("focus", cargarDatos);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoLibro = {
      isbn,
      titulo: nombre,
      descripcion,
      precio,
      url_portada: imagenUrl,
      url_libro: urlLibro,
      id_categoria: Number(categoria),
      id_autor: Number(autor),
    };

    axios
      .post("http://35.94.124.77:3000/libro/crear", nuevoLibro)
      .then((res) => {
        setLibros([...libros, res.data]);
        setImagenUrl("");
        setNombre("");
        setAutor("");
        setDescripcion("");
        setCategoria("");
        setPrecio("");
        setIsbn("");
        setUrlLibro("");
      });
  };

  const handleImagenUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagenUrl(url);
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setUrlLibro(url);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8 border border-gray-200"
    >
      <h2 className="text-3xl font-bold text-center text-blue-700 flex items-center justify-center gap-3">
        <BookOpen className="w-7 h-7" /> Crear Nuevo Libro
      </h2>

      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-800 mb-1">
          📷 Portada
        </legend>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Image className="w-4 h-4 text-blue-500" /> URL de la Imagen
          </label>
          <input
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="w-full h-48 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center">
          {imagenUrl ? (
            <img
              src={imagenUrl}
              alt="Vista previa"
              className="max-h-full max-w-full object-contain rounded-md"
            />
          ) : (
            <span className="text-gray-400 text-sm">
              Vista previa de la imagen
            </span>
          )}
        </div>

        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
          <UploadCloud className="w-6 h-6 text-blue-500" />
          <span className="text-sm text-gray-600 font-medium">
            Subir imagen desde tu equipo
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagenUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-800 mb-1">
          📘 Información del Libro
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              placeholder="Título del libro"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <label className="text-sm font-medium text-gray-700 mb-1">Autor</label>
        <select
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Seleccione un autor</option>
          {autores.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>

        <label className="text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          placeholder="Descripción del libro"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm shadow-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-800 mb-1">
          Categoría y Precio
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombrecat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">
              Precio (S/)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-800 mb-1">
          📎 Archivo PDF
        </legend>

        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
          <FilePlus className="w-6 h-6 text-blue-500" />
          <span className="text-sm text-gray-600 font-medium">
            Subir archivo PDF
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <label className="text-sm font-medium text-gray-700">
          URL del archivo PDF
        </label>
        <input
          type="text"
          placeholder="https://ejemplo.com/archivo.pdf"
          value={urlLibro}
          onChange={(e) => setUrlLibro(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </fieldset>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
      >
        <Save size={18} /> GUARDAR LIBRO
      </button>
    </form>
  );
};

export default LibroCrear;
