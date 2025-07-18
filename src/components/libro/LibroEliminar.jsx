import React, { useEffect, useState } from "react";

const LibroEliminar = () => {
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [confirmar, setConfirmar] = useState(false);
  const [eliminado, setEliminado] = useState(false);

  useEffect(() => {
    const storedCategorias = localStorage.getItem("categorias");
    setCategorias(storedCategorias ? JSON.parse(storedCategorias) : []);
    const stored = localStorage.getItem("libros");
    setLibros(stored ? JSON.parse(stored) : []);
  }, []);

  const librosFiltrados = filtroCategoria
    ? libros.filter(l => l.categoria === categorias.find(c => c.id === Number(filtroCategoria))?.nombre)
    : libros;

  const seleccionarLibro = idx => {
    setLibroSeleccionado(idx);
    setConfirmar(true);
    setEliminado(false);
  };

  const cancelar = () => {
    setConfirmar(false);
    setLibroSeleccionado(null);
    setEliminado(false);
  };

  const eliminarLibro = () => {
    const actualizados = [...libros];
    actualizados.splice(libroSeleccionado, 1);
    setLibros(actualizados);
    localStorage.setItem("libros", JSON.stringify(actualizados));
    setConfirmar(false);
    setEliminado(true);
    setLibroSeleccionado(null);
  };

  const cerrarMensaje = () => setEliminado(false);

  return (
    <div style={{maxWidth:'900px',margin:'0 auto',position:'relative'}}>
      <h2>Eliminar Libro</h2>
      <div style={{marginBottom:'16px'}}>
        <select value={filtroCategoria} onChange={e=>setFiltroCategoria(e.target.value)} style={{padding:'8px',borderRadius:'4px',border:'1px solid #B0B0B0'}}>
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>
      {/* Vista de libros como tarjetas */}
      <div style={{display:'flex',flexWrap:'wrap',gap:'32px',justifyContent:'flex-start',marginTop:'24px'}}>
        {librosFiltrados.map((libro, idx) => (
          <div key={idx} style={{width:'180px',display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'24px'}}>
            <div style={{width:'150px',height:'200px',background:'#F4F6F8',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',marginBottom:'12px'}}>
              {libro.imagenUrl ? <img src={libro.imagenUrl} alt="" style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}} /> : '-'}
            </div>
            <div style={{textAlign:'center',fontSize:'16px',fontWeight:'500',marginBottom:'4px'}}>{libro.nombre}</div>
            <div style={{textAlign:'center',fontSize:'15px',color:'#444',marginBottom:'8px'}}>{libro.autor || <span style={{color:'#bbb'}}>Sin autor</span>}</div>
            <div style={{textAlign:'center',fontWeight:'bold',fontSize:'18px',color:'#111'}}>S/{Number(libro.precio).toFixed(2)}</div>
            <button style={{marginTop:'10px',background:'#D7263D',color:'#fff',border:'none',borderRadius:'4px',padding:'4px 10px',fontWeight:'bold',fontSize:'13px',cursor:'pointer'}} onClick={e => {e.stopPropagation();seleccionarLibro(idx);}}>Eliminar</button>
          </div>
        ))}
      </div>
      {confirmar && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000}}>
          <div style={{background:'#fff',padding:'32px 24px',borderRadius:'8px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)',minWidth:'320px',textAlign:'center'}}>
            <p style={{fontSize:'18px',marginBottom:'24px'}}>¿Seguro que desea eliminar el libro?</p>
            <div style={{display:'flex',justifyContent:'center',gap:'16px'}}>
              <button onClick={cancelar} style={{background:'#B0B0B0',color:'#fff',border:'none',borderRadius:'4px',padding:'8px 24px',fontWeight:'bold',fontSize:'15px'}}>Cancelar</button>
              <button onClick={eliminarLibro} style={{background:'#D7263D',color:'#fff',border:'none',borderRadius:'4px',padding:'8px 24px',fontWeight:'bold',fontSize:'15px'}}>Sí</button>
            </div>
          </div>
        </div>
      )}
      {eliminado && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000}}>
          <div style={{background:'#fff',padding:'32px 24px',borderRadius:'8px',boxShadow:'0 2px 8px rgba(0,0,0,0.15)',minWidth:'320px',textAlign:'center'}}>
            <p style={{fontSize:'18px',marginBottom:'24px'}}>Libro eliminado</p>
            <button onClick={cerrarMensaje} style={{background:'#1746A2',color:'#fff',border:'none',borderRadius:'4px',padding:'8px 24px',fontWeight:'bold',fontSize:'15px'}}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibroEliminar;