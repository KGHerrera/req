import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context/contextprovider';
import Navbar from '../components/Navbar';
import axiosClient from '../axiosClient';
import Swal from 'sweetalert2';

const Folios = () => {
    const { user } = useStateContext();
    const [folios, setFolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [totalPages, setTotalPages] = useState(1);   // Total de páginas disponibles
    const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda inicial vacío
    const [newEstado, setNewEstado] = useState(''); // Estado nuevo

    const fetchFolios = async () => {
        try {
            const params = {
                page: currentPage,
            };
            if (searchTerm.trim() !== '') {
                params.search = searchTerm;
            }
            let url = `/folios/usuario/${user.id}`;

            // Determina la ruta según el rol del usuario
            if (['financiero', 'vinculacion', 'direccion'].includes(user.rol)) {
                url = '/folio-requisicion/user-role';
            }

            const response = await axiosClient.get(url, { params });
            setFolios(response.data.data);
            setTotalPages(response.data.last_page);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error al obtener los folios');
            setFolios([]); // Restablecer el estado de folios a un array vacío
            setTotalPages(1);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.id !== undefined) {
            fetchFolios();
            setNewEstado(getNextEstado(user.rol));
        }

    }, [user, currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // Actualizar la página actual al hacer clic en una página
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Actualizar el término de búsqueda
        setCurrentPage(1); // Reiniciar a la primera página al cambiar el término de búsqueda
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault(); // Prevenir el envío del formulario por defecto
        setCurrentPage(1);
        await fetchFolios(); // Use async
    };

    const handleAcceptFolio = async (folioId) => {
        try {
            await axiosClient.patch(`/folios/${folioId}/estado`, { estado: newEstado });
            await fetchFolios(); // Refrescar la lista de folios después de aceptar
            Swal.fire('Folio Aceptado', 'El folio ha sido aceptado correctamente', 'success');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error al actualizar el estado');
            Swal.fire('Error', 'Hubo un problema al aceptar el folio', 'error');
        }
    };

    const handleRejectFolio = async (folioId, motivoRechazo) => {
        try {
            await axiosClient.patch(`/folios/${folioId}/estado`, { estado: 'rechazada', motivo_rechazo: motivoRechazo });
            await fetchFolios(); // Refrescar la lista de folios después de rechazar
            Swal.fire('Folio Rechazado', 'El folio ha sido rechazado correctamente', 'success');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error al actualizar el estado');
            Swal.fire('Error', 'Hubo un problema al rechazar el folio', 'error');
        }
    };

    const getNextEstado = (rol) => {
        switch (rol) {
            case 'financiero':
                return 'primera_autorizacion';
            case 'vinculacion':
                return 'segunda_autorizacion';
            case 'direccion':
                return 'tercera_autorizacion';
            default:
                return '';
        }
    };

    const handleModalAccept = (folioId) => {
        
        
        

        Swal.fire({
            title: 'Aceptar Folio',
            text: '¿Estás seguro de que quieres aceptar este folio?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleAcceptFolio(folioId);
            }
        });
    };

    const handleModalReject = (folioId) => {
        
        
        Swal.fire({
            title: 'Rechazar Folio',
            html: '<textarea id="motivoRechazo" class="form-control" rows="3" placeholder="Motivo de rechazo"></textarea>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Rechazar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const motivo = document.getElementById('motivoRechazo').value;
                if (!motivo) {
                    Swal.showValidationMessage('Debes ingresar un motivo de rechazo');
                }
                return motivo;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                
                handleRejectFolio(folioId, result.value);
            }
        });
    };
    

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="row mb-3">
                    <div className="col-md-6 row">
                        <form onSubmit={handleSearchSubmit} className="row g-4 align-items-center">
                            <div className="col-md-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <button type="submit" className="btn btn-primary w-100">Buscar</button>
                            </div>
                        </form>
                    </div>
                </div>
                {loading ? (
                    <p>Cargando...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <>
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            {folios.length > 0 ? (
                                folios.map((folio, index) => (
                                    <div key={folio.folio} className="col">
                                        <div className="card h-100">
                                            <div className="card-header">
                                                Folio: {folio.folio}
                                            </div>
                                            <div className="card-body">
                                                <p><strong>Fecha de Solicitud:</strong> {folio.fecha_solicitud}</p>
                                                <p><strong>Fecha de Entrega:</strong> {folio.fecha_entrega}</p>
                                                <p><strong>Total Estimado:</strong> {folio.total_estimado}</p>
                                                <p><strong>Clave de Departamento:</strong> {folio.clave_departamento}</p>
                                                { folio.motivo_rechazo && <p className="text-danger"><strong>Motivo de rechazo:</strong> {folio.motivo_rechazo}</p>}
                                                <h5>Requisiciones:</h5>
                                                <div className="table-responsive">
                                                    <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Partida</th>
                                                                <th scope="col">Cantidad</th>
                                                                <th scope="col">Unidad</th>
                                                                <th scope="col">Descripción</th>
                                                                <th scope="col">Costo</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {folio.requisiciones.map((requisicion, reqIndex) => (
                                                                <tr key={reqIndex}>
                                                                    <td>{requisicion.partida_presupuestal}</td>
                                                                    <td>{requisicion.cantidad}</td>
                                                                    <td>{requisicion.unidad}</td>
                                                                    <td>{requisicion.descripcion_bienes_servicios}</td>
                                                                    <td>{requisicion.costo_estimado} </td>
                                                                    </tr>
                                                               ))}
                                                           </tbody>
                                                       </table>
                                                   </div>
                                               </div>
                                               <div className="card-footer text-muted">
                                                   Estado: <span className="badge bg-primary">{folio.estado}</span>
                                                   <br />
                                                   {/* Botones de acciones */}
                                                   {['financiero', 'vinculacion', 'direccion'].includes(user.rol) && (
                                                       <>
                                                           <button className="btn btn-success mt-2 me-2" onClick={() => handleModalAccept(folio.folio)}>
                                                               Aceptar
                                                           </button>
                                                           <button className="btn btn-danger mt-2" onClick={() => handleModalReject(folio.folio)}>
                                                               Rechazar
                                                           </button>
                                                       </>
                                                   )}
                                               </div>
                                           </div>
                                       </div>
                                   ))
                               ) : (
                                   <div className="col">
                                       <p>No se encontraron folios para este usuario.</p>
                                   </div>
                               )}
                           </div>
                           {/* Paginación */}
                           {folios.length > 0 && (
                               <nav aria-label="Page navigation example">
                                   <p className="text-center mt-3">Total de folios: {folios.length}</p>
                                   <ul className="pagination mt-3 justify-content-center">
                                       {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                                           <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                               <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                                           </li>
                                       ))}
                                   </ul>
                               </nav>
                           )}

                   
                       </>
                   )}
               </div>
           </>
       );
   };

   export default Folios;

