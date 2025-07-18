import { useState } from "react";
import { FolderKanban, BookOpenText, Users, Layers3 } from "lucide-react";
import AutorCrear from "./components/autor/AutorCrear";
import AutorEditar from "./components/autor/AutorEditar";
import AutorListar from "./components/autor/AutorListar";
import CategoriaCrear from "./components/categoria/CategoriaCrear";
import CategoriaEditar from "./components/categoria/CategoriaEditar";
import CategoriaListar from "./components/categoria/CategoriaListar";
import LibroCrear from "./components/libro/LibroCrear";
import LibroEditar from "./components/libro/LibroEditar";
import LibroEliminar from "./components/libro/LibroEliminar";
import LibroListar from "./components/libro/LibroListar";
import Dashboard from "./components/autor/Dashboard";
import "./App.css";

function App() {
  const [vista, setVista] = useState("");
  const [open, setOpen] = useState({
    autor: false,
    categoria: false,
    libro: false,
  });

  const toggle = (key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderVista = () => {
    switch (vista) {
      case "Dashboard":
        return <Dashboard />;
      case "AutorCrear":
        return <AutorCrear />;
      case "AutorEditar":
        return <AutorEditar />;
      case "AutorListar":
        return <AutorListar />;
      case "CategoriaCrear":
        return <CategoriaCrear />;
      case "CategoriaEditar":
        return <CategoriaEditar />;
      case "CategoriaListar":
        return <CategoriaListar />;
      case "LibroCrear":
        return <LibroCrear />;
      case "LibroEditar":
        return <LibroEditar />;
      case "LibroEliminar":
        return <LibroEliminar />;
      case "LibroListar":
        return <LibroListar />;
      default:
        return (
          <div className="">
            <Dashboard />;
          </div>
        );
    }
  };

  const SidebarSection = ({ title, icon: Icon, toggleKey, children }) => (
    <div>
      <button
        onClick={() => toggle(toggleKey)}
        className="flex items-center gap-2 w-full px-4 py-2 text-left text-white hover:bg-blue-600 transition duration-200"
      >
        <Icon className="w-5 h-5" />
        <span className="font-semibold">{title}</span>
      </button>
      {open[toggleKey] && (
        <div className="ml-6 flex flex-col gap-1 mt-2">{children}</div>
      )}
    </div>
  );

  const SidebarButton = ({ label, viewKey }) => (
    <button
      onClick={() => setVista(viewKey)}
      className={`text-sm text-white px-3 py-1 rounded-md text-left hover:bg-blue-500 transition ${
        vista === viewKey ? "bg-blue-700 font-semibold" : ""
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FolderKanban className="w-6 h-6" />
          Panel Admin
        </h2>
        <nav className="flex flex-col gap-4">
          <SidebarSection title="Dashboard" icon={Users} toggleKey="dashboard">
            <SidebarButton label="Dashboard Admin" viewKey="Dashboard" />
          </SidebarSection>

          <SidebarSection title="Autores" icon={Users} toggleKey="autor">
            <SidebarButton label="Registrar Autor" viewKey="AutorCrear" />
            <SidebarButton label="Editar Autor" viewKey="AutorEditar" />
            <SidebarButton label="Listar Autores" viewKey="AutorListar" />
          </SidebarSection>

          <SidebarSection
            title="Categorías"
            icon={Layers3}
            toggleKey="categoria"
          >
            <SidebarButton label="Crear Categoría" viewKey="CategoriaCrear" />
            <SidebarButton label="Editar Categoría" viewKey="CategoriaEditar" />
            <SidebarButton
              label="Listar Categorías"
              viewKey="CategoriaListar"
            />
          </SidebarSection>

          <SidebarSection title="Libros" icon={BookOpenText} toggleKey="libro">
            <SidebarButton label="Crear Libro" viewKey="LibroCrear" />
            <SidebarButton label="Editar Libro" viewKey="LibroEditar" />
            <SidebarButton label="Eliminar Libro" viewKey="LibroEliminar" />
            <SidebarButton label="Listar Libros" viewKey="LibroListar" />
          </SidebarSection>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">{renderVista()}</main>
    </div>
  );
}

export default App;
