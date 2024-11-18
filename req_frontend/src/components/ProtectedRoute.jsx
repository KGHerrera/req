import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStateContext } from '../context/contextprovider';

const ProtectedRoute = ({ allowedRoles, children }) => {
    
    const { user } = useStateContext();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user?.rol)) {
        // Condicionar la redirección según el rol del usuario
        switch (user?.rol) {
            case 'admin':
                return <Navigate to="/usuarios" replace />;

            case 'vinculacion':
            case 'direccion':
            case 'materiales':
            case 'subdireccion':
                return <Navigate to="/folios" replace />;

            case 'user':
                return <Navigate to="/requisiciones" replace />;
        }
    }



    return children;
};

export default ProtectedRoute;

