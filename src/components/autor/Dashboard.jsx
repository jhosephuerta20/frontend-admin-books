import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  ShoppingCart,
  CalendarDays,
  PencilLine,
  FileText,
} from "lucide-react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVentas: 0,
    cantidadAutores: 0,
    cantidadUsuarios: 0,
    cantidadLibros: 0,
    cantidadCompras: 0,
    libros: [],
    categorias: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [librosRes, categoriasRes, usuariosRes, autoresRes, ventasRes] =
          await Promise.all([
            axios.get("http://35.94.124.77:3000/libro/listar"),
            axios.get("http://35.94.124.77:3000/categorias/listar"),
            axios.get("http://35.94.124.77:3000/usuario/listar"),
            axios.get("http://35.94.124.77:3000/autor/listar"),
            axios.get("http://35.94.124.77:3000/ventas/listar"),
          ]);

        setStats({
          libros: librosRes.data.libros,
          categorias: categoriasRes.data.categorias,
          cantidadLibros: librosRes.data.libros.length,
          cantidadUsuarios: usuariosRes.data.usuarios?.length || 0,
          cantidadAutores: autoresRes.data.autores?.length || 0,
          cantidadCompras: ventasRes.data.ventas?.length || 0,
          totalVentas: ventasRes.data.ventas?.reduce(
            (acc, venta) => acc + parseFloat(venta.total),
            0
          ),
        });
      } catch (err) {
        console.error("Error cargando datos del dashboard", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard - Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          icon={<ShoppingCart className="text-green-600" />}
          title="Total Ventas"
          value={`S/ ${stats.totalVentas.toFixed(2)}`}
        />
        <Card
          icon={<PencilLine className="text-blue-600" />}
          title="Autores Registrados"
          value={stats.cantidadAutores}
        />
        <Card
          icon={<Users className="text-purple-600" />}
          title="Usuarios Registrados"
          value={stats.cantidadUsuarios}
        />
        <Card
          icon={<BookOpen className="text-orange-600" />}
          title="Libros en Catálogo"
          value={stats.cantidadLibros}
        />
        <Card
          icon={<FileText className="text-red-600" />}
          title="Compras Realizadas"
          value={stats.cantidadCompras}
        />
        <Card
          icon={<CalendarDays className="text-gray-700" />}
          title="Categorías Disponibles"
          value={stats.categorias.length}
        />
      </div>

      {/* En el futuro se pueden agregar gráficas y filtros */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Próximamente: Análisis por día y mes
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500">Funcionalidad en desarrollo...</p>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
      <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
      <div>
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
