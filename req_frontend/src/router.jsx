import {createBrowserRouter} from 'react-router-dom'
import Login from './views/Login'
import Register from './views/Register'
import DefaulyLayout from './components/DefaulyLayout';
import GuestLayout from './components/GuestLayout';
import Requisiciones from './views/Requisiciones';
import Folios from './views/Folios';
import OrdenCompra from './views/OrdenCompra';
import Compra from './views/Compra';

const router = createBrowserRouter([
    {
        path: '/',
        element:<DefaulyLayout/>,
        children: [
            
        {
            path: '/requisiciones',
            element: <Requisiciones/>
        },
        {
            path: '/folios',
            element: <Folios/>
        },
        {
            path: '/orden_compra',
            element: <OrdenCompra/>
        }
        ,
        {
            path: '/compra',
            element: <Compra/>
        }
    
    ]     
    }, 

    {
        path: '/',
        element: <GuestLayout/>,
        children : [
            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: '/register',
                element: <Register></Register>
            }
        ]
    }
]);

export default router