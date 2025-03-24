import React, { useState, useEffect } from "react";

export default function GestionEventos() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8100/api/eventos") // URL correcta
      .then(response => response.json())
      .then(data => setEventos(data)) // Almacenar los eventos en el estado
      .catch(error => console.error("Error fetching eventos:", error));
  }, []);
  

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Gestión de Eventos</h1>
      <div className="mb-4">
        <button className="bg-blue-500 text-white p-2 rounded">Crear Evento</button>
      </div>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Nombre</th>
            <th className="px-4 py-2 border-b">Fecha</th>
            <th className="px-4 py-2 border-b">Espacio</th>
            <th className="px-4 py-2 border-b">Estado</th>
            <th className="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((evento) => (
            <tr key={evento.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{evento.nombre}</td>
              <td className="px-4 py-2 border-b">{evento.fecha}</td>
              <td className="px-4 py-2 border-b">{evento.espacio}</td>
              <td className="px-4 py-2 border-b">{evento.estado}</td>
              <td className="px-4 py-2 border-b">
                <button className="bg-green-500 text-white p-2 rounded mr-2">Ver</button>
                <button className="bg-yellow-500 text-white p-2 rounded mr-2">Editar</button>
                <button className="bg-red-500 text-white p-2 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
