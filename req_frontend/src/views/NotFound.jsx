import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center">
            <h1 className="display-1 fw-bold text-danger">404</h1>
            <p className="lead text-secondary">Oops! La página que buscas no existe.</p>
            <Link to="/" className="btn btn-primary btn-lg mt-3 d-flex align-items-center">
                <FaHome className="me-2" />
                Regresar al Inicio
            </Link>
        </div>
    );
};

export default NotFound;
