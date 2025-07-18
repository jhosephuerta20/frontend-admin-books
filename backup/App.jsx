import { useState } from "react";
import BookForm from "./components/BookFrom.jsx";
import BookList from "./components/BooKList.jsx";

function App() {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [showForm, setShowForm] = useState(false);

  const addBook = (book) => {
    const bookWithId = { ...book, id: Date.now() + Math.random() };
    setBooks([...books, bookWithId]);
  };

  const deleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredBooks =
    selectedCategory === "Todas"
      ? books
      : books.filter((book) => book.categoria === selectedCategory);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">eBook</h2>
        <nav className="flex flex-col gap-3">
          <button className="text-left hover:text-blue-500 transition">
            Principal
          </button>
          <button className="text-left hover:text-blue-500 transition">
            Categorías
          </button>
          <button className="text-left hover:text-blue-500 transition">
            Filtros
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">
          Administración de Libros
        </h1>

        <button
          className="mb-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cerrar Formulario" : "Agregar Libro"}
        </button>

        {showForm && (
          <div className="mb-8 bg-white p-6 rounded shadow">
            <BookForm onAddBook={addBook} />
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Filtrar por categoría:
          </label>
          <select
            className="w-full md:w-64 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="Todas">Todas</option>
            <option value="Ficción">Ficción</option>
            <option value="No Ficción">No Ficción</option>
            <option value="Ciencia">Ciencia</option>
            <option value="Historia">Historia</option>
            <option value="Horror">Horror</option>
          </select>
        </div>

        <div className="grid gap-6">
          <BookList books={filteredBooks} onDelete={deleteBook} />
        </div>
      </main>
    </div>
  );
}

export default App;
