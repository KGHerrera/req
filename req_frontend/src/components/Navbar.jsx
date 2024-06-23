import React from 'react';
import { useStateContext } from '../context/contextprovider'; // Asegúrate de importar tu contexto adecuadamente
import axiosClient from '../axiosClient';

const Navbar = () => {
    const { user, setUser, setToken } = useStateContext(); // Asegúrate de tener acceso al estado de usuario y funciones de contexto
    const onLogout = (e) => {
        e.preventDefault();

        axiosClient.post('/logout').then(() => {
            setUser(null);
            setToken(null);
        });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    
                    TECNM
                </a>
                {user && (
                    <div className="navbar-text mx-auto text-center">
                        {user.name}
                    </div>
                )}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <button className="btn btn-dark" onClick={onLogout}>Cerrar Sesión</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
