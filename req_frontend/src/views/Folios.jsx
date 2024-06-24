import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context/contextprovider';
import Navbar from '../components/Navbar';
import axiosClient from '../axiosClient';

const Folios = () => {
    const { user } = useStateContext();
    const [folios, setFolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [totalPages, setTotalPages] = useState(1);   // Total de páginas disponibles
    const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda inicial vacío

    const fetchFolios = async () => {
        try {
            const params = {
                page: currentPage,
            };
            if (searchTerm.trim() !== '') {
                params.search = searchTerm;
            }

            const response = await axiosClient.get(`/folios/usuario/${user.id}`, { params });
            setFolios(response.data.data);
            setTotalPages(response.data.last_page);
            setLoading(false);
            setError(null);

            console.log(response.data);
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
                                                <p><strong>Usuario ID:</strong> {folio.user_id}</p>
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
                                                                    <td>{requisicion.costo_estimado}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="card-footer text-muted">
                                                Estado: <span className="badge bg-primary">{folio.estado}</span>
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
