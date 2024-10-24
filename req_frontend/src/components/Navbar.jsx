import React from 'react';
import { useStateContext } from '../context/contextprovider'; // Asegúrate de importar tu contexto adecuadamente
import axiosClient from '../axiosClient';
import { NavLink } from 'react-router-dom';

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
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">

                        {/* Mostrar "Agregar requisiciones" solo para roles que pueden verlas */}
                        {!['direccion', 'financiero', 'vinculacion', 'materiales'].includes(user?.rol) && (
                            <li className="nav-item">
                                <NavLink className="nav-link" activeclassname="active" to="/requisiciones">
                                    Agregar requisiciones
                                </NavLink>
                            </li>
                        )}

                        {/* Mostrar "Folios" para todos los roles */}
                        <li className="nav-item">
                            <NavLink className="nav-link" activeclassname="active" to="/folios">
                                Folios
                            </NavLink>
                        </li>

                        {/* Mostrar "Ordenes de compra" solo para el rol "materiales" */}
                        {user?.rol === 'materiales' && (
                            <li className="nav-item">
                                <NavLink className="nav-link" activeclassname="active" to="/compra">
                                    Ordenes de compra
                                </NavLink>
                            </li>
                        )}

                    </ul>

                    {/* Botón de Cerrar Sesión */}
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
