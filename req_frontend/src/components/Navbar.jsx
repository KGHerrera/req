import React from 'react';
import { useStateContext } from '../context/contextprovider';
import axiosClient from '../axiosClient';
import { NavLink } from 'react-router-dom';
import { FaPlusSquare, FaFolderOpen, FaClipboardList, FaUserAstronaut, FaUser, FaSignOutAlt, FaUserCircle, FaBuilding } from 'react-icons/fa';
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
        <nav className="navbar navbar-expand-lg bg-primary navbar-dark border-bottom shadow-sm">
            <div className="container-fluid px-4">
                {/* Logo Section */}
                <a className="navbar-brand d-flex align-items-center" href="/">
                    <span className="fw-bold">TECNM</span>
                </a>

                {/* Hamburger Button */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* Navigation Links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {!['direccion', 'financiero', 'vinculacion', 'materiales', 'admin'].includes(user?.rol) && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link d-flex align-items-center px-3 py-2 mx-1"
                                    to="/requisiciones"
                                >
                                    <FaPlusSquare className="me-2" />
                                    <span>Agregar requisiciones</span>
                                </NavLink>
                            </li>
                        )}

                        {user?.rol !== 'admin' && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link d-flex align-items-center px-3 py-2 mx-1"
                                    to="/folios"
                                >
                                    <FaFolderOpen className="me-2" />
                                    <span>Folios</span>
                                </NavLink>
                            </li>
                        )}

                        {user?.rol === 'materiales' && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link d-flex align-items-center px-3 py-2 mx-1"
                                    to="/compra"
                                >
                                    <FaClipboardList className="me-2" />
                                    <span>Ordenes de compra</span>
                                </NavLink>
                            </li>
                        )}

                        {user?.rol === 'admin' && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link d-flex align-items-center px-3 py-2 mx-1"
                                    to="/usuarios"
                                >
                                    <FaUserAstronaut className="me-2" />
                                    <span>Usuarios</span>
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    {/* User Section */}
                    <div className="d-flex align-items-center">
                        {user && (
                            <div className="dropdown">
                                <button
                                    className="btn btn-primary dropdown-toggle d-flex align-items-center"
                                    type="button"
                                    id="userDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <div className="bg-light rounded px-1 me-2">
                                        <FaUser className="text-primary" />
                                    </div>
                                    <span className="me-2">{user.name}</span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                                    <li className="px-3 py-2 d-flex align-items-center">
                                        <FaUserCircle className="me-2 text-muted" />
                                        <div>
                                            <div className="fw-bold">{user.name}</div>
                                            <small className="text-muted">{user.rol}</small>
                                        </div>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <span className="dropdown-item-text">
                                            <FaBuilding className="me-2 text-muted" />
                                            <small className="text-muted">{user.clave_departamento}</small>
                                        </span>
                                    </li>
                                    <li>
                                        <span className="dropdown-item-text">
                                            <small className="text-muted">{user.email}</small>
                                        </span>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button
                                            className="dropdown-item text-danger d-flex align-items-center"
                                            onClick={onLogout}
                                        >
                                            <FaSignOutAlt className="me-2" />
                                            Cerrar Sesión
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Notification Bell */}
                        <div className="me-0 pe-0 position-relative">
                            <NotificationBell />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
