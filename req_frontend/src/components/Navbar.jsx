import React from 'react';
import { useStateContext } from '../context/contextprovider';
import axiosClient from '../axiosClient';
import { NavLink } from 'react-router-dom';
import { FaPlusSquare, FaFolderOpen, FaSignOutAlt, FaUser, FaClipboardList, FaUserAstronaut } from 'react-icons/fa';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const { user, setUser, setToken } = useStateContext();

    const onLogout = (e) => {
        e.preventDefault();

        axiosClient.post('/logout').then(() => {
            setUser(null);
            setToken(null);
        });
    };

    return (
        <nav className="navbar navbar-expand-lg bg-primary navbar-dark">
            <div className="container-fluid">
                {/* Logo */}
                <a className="navbar-brand" href="/">
                    TECNM
                </a>

                {/* Menú de Navegación */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {!['direccion', 'financiero', 'vinculacion', 'materiales', 'admin'].includes(user?.rol) && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/requisiciones">
                                    <FaPlusSquare className="me-1" /> Agregar requisiciones
                                </NavLink>
                            </li>
                        )}
                        {user?.rol !== 'admin' && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/folios">
                                    <FaFolderOpen className="me-1" /> Folios
                                </NavLink>
                            </li>
                        )}
                        {user?.rol === 'materiales' && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/compra">
                                    <FaClipboardList className="me-1" /> Ordenes de compra
                                </NavLink>
                            </li>
                        )}
                        {user?.rol === 'admin' && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/usuarios">
                                    <FaUserAstronaut className="me-1" /> Usuarios
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    {/* Usuario y Cerrar Sesión */}
                    <div className="d-flex align-items-center">



                        {user && (
                            <span className="navbar-text active d-flex align-items-center me-2">
                                <FaUser className="me-1" />
                                {user.name}
                            </span>
                        )}

                        <NotificationBell />

                        <button className="btn btn-light" onClick={onLogout}>
                            <FaSignOutAlt className="me-1" /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
