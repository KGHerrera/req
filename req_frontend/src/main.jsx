import React from 'react'
import ReactDOM from 'react-dom/client'
// importar bootstrap
import '../public/bootstrap.min.css';
import router from './router.jsx'
import { RouterProvider } from 'react-router-dom'
import { ContextProvider } from './context/contextprovider.jsx'
import 'bootstrap/dist/js/bootstrap.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>,
)
