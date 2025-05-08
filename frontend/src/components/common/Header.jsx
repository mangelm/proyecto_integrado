

export default function Header () {

    return (
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="flex items-center gap-2">
            <img src="assets/logo.png" alt="Logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold">Gestor de Eventos</h1>
        </div>

        </header>
    );
};

