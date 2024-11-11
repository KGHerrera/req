import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context/contextprovider';
import Navbar from '../components/Navbar';
import axiosClient from '../axiosClient';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import { FaSearch, FaFile, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';


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
            if (['financiero', 'vinculacion', 'direccion', 'materiales'].includes(user.rol)) {
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
            confirmButtonColor: "#325d88",
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
            cancelButtonColor: "#325d88",
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
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-6">
                        <form onSubmit={handleSearchSubmit} className="row g-4 align-items-center">
                            <div className="col-md-12">
                                <div className="mb-1 form-group form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="buscar"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearchSubmit(e); // Llamamos a la función de submit al presionar Enter
                                            }
                                        }}
                                    />
                                    <label htmlFor="buscar">
                                        <FaSearch className="me-2" />
                                        Término de búsqueda ...
                                    </label>
                                    <small>Presiona Enter para buscar, deja la caja vaciá para mostrar todos los folios.</small>
                                </div>
                            </div>
                            {/* El botón está oculto */}
                            <div className="col-md-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ display: 'none' }} // Este estilo lo oculta
                                >
                                    <FaSearch className="me-2" />
                                    Buscar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : (
                    <>
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            {folios.length > 0 ? (
                                folios.map((folio) => (
                                    <div key={folio.folio} className="col">
                                        <div className="card h-100 shadow-sm">
                                            <div className="card-header bg-light py-3">
                                                <p className="mb-0 d-flex align-items-center">
                                                    {folio.folio}
                                                </p>
                                            </div>
                                            <div className="card-body">
                                                <div className="mb-3">
                                                    <small> <p className="mb-2"><strong>Fecha de Solicitud:</strong> {folio.fecha_solicitud}</p></small>
                                                    <small><p className="mb-2"><strong>Fecha de Entrega:</strong> {folio.fecha_entrega}</p></small>
                                                    <small><p className="mb-2"><strong>Total Estimado:</strong> {folio.total_estimado}</p></small>
                                                    <small><p className="mb-2"><strong>Clave de Departamento:</strong> {folio.clave_departamento}</p></small>
                                                    {folio.motivo_rechazo && (
                                                        <div className="alert alert-danger py-2 mb-2">
                                                            <small><strong>Motivo de rechazo:</strong> {folio.motivo_rechazo}</small>
                                                        </div>
                                                    )}
                                                </div>

                                                <small><p className="mb-3  fw-bold">Requisiciones:</p></small>
                                                <div className="table-responsive">
                                                    <table className="table table-sm table-hover table-bordered small">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Partida</th>
                                                                <th>Cantidad</th>
                                                                <th>Unidad</th>
                                                                <th>Descripción</th>
                                                                <th>Costo</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {folio.requisiciones.map((requisicion, reqIndex) => (
                                                                <tr key={reqIndex}>
                                                                    <td>{requisicion.partida_presupuestal}</td>
                                                                    <td>{requisicion.cantidad}</td>
                                                                    <td>{requisicion.unidad}</td>
                                                                    <td>{requisicion.descripcion_bienes_servicios}</td>
                                                                    <td>{requisicion.costo_estimado}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="card-footer bg-white border-top py-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="badge bg-primary px-3 py-2">
                                                        {folio.estado}
                                                    </span>
                                                    <div className="btn-group">
                                                        {['financiero', 'vinculacion', 'direccion'].includes(user.rol) && (
                                                            <>
                                                                <button
                                                                    className="btn btn-outline-primary"
                                                                    onClick={() => handleModalAccept(folio.folio)}
                                                                >
                                                                    <FaCheck className="me-2" />
                                                                    Aceptar
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger"
                                                                    onClick={() => handleModalReject(folio.folio)}
                                                                >
                                                                    <FaTimes className="me-2" />
                                                                    Rechazar
                                                                </button>
                                                            </>
                                                        )}
                                                        {['materiales'].includes(user.rol) && (
                                                            <Link
                                                                to={`/orden_compra`}
                                                                state={{ folio }}
                                                                className="btn btn-outline-primary"
                                                            >
                                                                <FaPlus className="me-2" />
                                                                Crear orden de compra
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col">
                                    <div className="alert alert-info">
                                        No se encontraron folios para este usuario.
                                    </div>
                                </div>
                            )}
                        </div>

                        {folios.length > 0 && (
                            <div className="mt-4">
                                <p className="text-center text-muted">
                                    Total de folios: {folios.length}
                                </p>
                                <nav aria-label="Navegación de páginas">
                                    <ul className="pagination justify-content-center">
                                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                                            <li
                                                key={page}
                                                className={`page-item ${currentPage === page ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Folios;

