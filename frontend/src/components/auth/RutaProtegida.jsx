import { Navigate } from "react-router-dom";

export default function RutaProtegida({ children, rolesRequeridos }) {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if (!token) {
        return <Navigate to="/" replace />; // Redirige al login si no está autenticado
    }

    // Verifica si el rol del usuario está en la lista de roles permitidos
    if (rolesRequeridos && !rolesRequeridos.includes(rol)) {
        return <Navigate to="/acceso-denegado" replace />; // Redirige al componente "Acceso Denegado"
    }

    return children;
}