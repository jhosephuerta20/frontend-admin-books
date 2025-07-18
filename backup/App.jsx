import { useState } from 'react';
import BookForm from './components/BookFrom.jsx';
import BookList from './components/BooKList.jsx';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showForm, setShowForm] = useState(false);

  const addBook = (book) => {
    const bookWithId = { ...book, id: Date.now() + Math.random() };
    setBooks([...books, bookWithId]);
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredBooks =
    selectedCategory === 'Todas'
      ? books
      : books.filter((book) => book.categoria === selectedCategory);

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>eBook</h2>
        <nav>
          <button>Principal</button>
          <button>Categorías</button>
          <button>Filtros</button>
        </nav>
      </aside>

      <main className="main">
        <h1>Administración de Libros</h1>

        <button
          className="button-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cerrar Formulario' : 'Agregar Libro'}
        </button>

        {showForm && <BookForm onAddBook={addBook} />}

        <div className="category-filter">
          <label>Filtrar por categoría:</label>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="Todas">Todas</option>
            <option value="Ficción">Ficción</option>
            <option value="No Ficción">No Ficción</option>
            <option value="Ciencia">Ciencia</option>
            <option value="Historia">Historia</option>
            <option value="Horror">Horror</option>
          </select>
        </div>

        <div className="book-list">
          <BookList books={filteredBooks} onDelete={deleteBook} />
        </div>
      </main>
    </div>
  );
}

export default App;
