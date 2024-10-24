import { createBrowserRouter } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';
import DefaulyLayout from './components/DefaulyLayout';
import GuestLayout from './components/GuestLayout';
import Requisiciones from './views/Requisiciones';
import Folios from './views/Folios';
import OrdenCompra from './views/OrdenCompra';
import Compra from './views/Compra';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaulyLayout />,
        children: [
            {
                path: '/requisiciones',
                element: (
                    <ProtectedRoute allowedRoles={['user']}>
                        <Requisiciones />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/folios',
                element: (
                    <ProtectedRoute allowedRoles={['materiales', 'financiero', 'vinculacion', 'direccion']}>
                        <Folios />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/orden_compra',
                element: (
                    <ProtectedRoute allowedRoles={['materiales']}>
                        <OrdenCompra />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/compra',
                element: (
                    <ProtectedRoute allowedRoles={['materiales']}>
                        <Compra />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
        ],
    },
]);

export default router;
