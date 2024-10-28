import React from 'react';
import { useStateContext } from '../context/contextprovider';
import axiosClient from '../axiosClient';
import { NavLink } from 'react-router-dom';
import { FaPlusSquare, FaFolderOpen, FaSignOutAlt, FaUser, FaClipboardList } from 'react-icons/fa';

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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {/* Logo */}
                <a className="navbar-brand" href="/">
                    TECNM
                </a>

                {/* Usuario */}
                {user && (
                    <div className="navbar-text d-flex align-items-center">
                        <FaUser className="me-1" />
                        {user.name}
                    </div>
                )}

                {/* Menú de Navegación */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        {!['direccion', 'financiero', 'vinculacion', 'materiales'].includes(user?.rol) && (
                            <li className="nav-item">
                                <NavLink className="nav-link" activeclassname="active" to="/requisiciones">
                                    <FaPlusSquare className="me-1" /> Agregar requisiciones
                                </NavLink>
                            </li>
                        )}
                        <li className="nav-item">
                            <NavLink className="nav-link" activeclassname="active" to="/folios">
                                <FaFolderOpen className="me-1" /> Folios
                            </NavLink>
                        </li>
                        {user?.rol === 'materiales' && (
                            <li className="nav-item">
                                <NavLink className="nav-link" activeclassname="active" to="/compra">
                                    <FaClipboardList className="me-1" /> Ordenes de compra
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Botón de Cerrar Sesión */}
                <div className="d-flex align-items-center">
                    <button className="btn btn-dark ms-3" onClick={onLogout}>
                        <FaSignOutAlt className="me-1" /> Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
