import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStateContext } from '../context/contextprovider';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user } = useStateContext();

    if (!allowedRoles.includes(user?.rol)) {
        // Condicionar la redirección según el rol del usuario
        switch (user?.rol) {
            case 'financiero':
            case 'vinculacion':
            case 'direccion':
                return <Navigate to="/folios" replace />;
            case 'materiales':
                return <Navigate to="/orden_compra" replace />;
        }
    } 

    return children; // Muestra la ruta si el usuario tiene el rol adecuado
};

export default ProtectedRoute;

