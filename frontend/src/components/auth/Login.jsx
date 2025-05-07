import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MensajesDeErrores from "../../pages/MensajesDeErrores";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errores, setErrores] = useState({});
    const [erroresGenerales, setErroresGenerales] = useState([]);
    const navegar = useNavigate();

    const manejoEnvio = async (e) => {
        e.preventDefault();
        setErrores({});
        setErroresGenerales([]);

        let formularioValido = true;
        let erroresVista = {};

        // Validaciones
        if (!email) erroresVista.email = "El email es obligatorio.";
        else if (!/\S+@\S+\.\S+/.test(email)) erroresVista.email = "El formato del email no es válido.";
        
        if (!password) {
            erroresVista.password = "La contraseña es obligatoria.";
        }

        if (Object.keys(erroresVista).length > 0) {
            setErrores(erroresVista);
            formularioValido = false;
        }

        if (!formularioValido) {
            return;
        }

        try {
            const response = await fetch("http://localhost:8100/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('rol', data.cliente.rol);
                navegar("/panel-administracion");
            } else {
                if (data.error) {
                    setErroresGenerales([data.error]);
                } else {
                    setErroresGenerales(["Error al iniciar sesión. Por favor, inténtalo de nuevo."]);
                }
            }
        } catch (error) {
            console.error("Error en fetch o procesando la respuesta:", error);
            setErroresGenerales(["No se pudo conectar con el servidor. Por favor, inténtalo de nuevo."]);
        }
    };

    const manejoCambioInput = (setter, nombreCampo) => (e) => {
        setter(e.target.value);
        if (errores[nombreCampo]) {
            setErrores((prevErrores) => ({ ...prevErrores, [nombreCampo]: null }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Iniciar Sesión
                    </h2>
                </div>

                {erroresGenerales.length > 0 && <MensajesDeErrores messages={erroresGenerales} />}

                <form className="mt-8 space-y-6" onSubmit={manejoEnvio}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={manejoCambioInput(setEmail, "email")}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    errores.email ? "border-red-500" : "border-gray-300"
                                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Email"
                            />
                            {errores.email && (
                                <p className="mt-1 text-xs text-red-600">{errores.email}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={manejoCambioInput(setPassword, "password")}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    errores.password ? "border-red-500" : "border-gray-300"
                                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Contraseña"
                            />
                            {errores.password && (
                                <p className="mt-1 text-xs text-red-600">{errores.password}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Iniciar Sesión
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes una cuenta?{" "}
                            <Link
                                to="/registro"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
} 