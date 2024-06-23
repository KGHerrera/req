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

    useEffect(() => {
        const fetchFolios = async () => {
            try {
                const response = await axiosClient.get(`/folios/usuario/${user.id}?page=${currentPage}`);
                setFolios(response.data.data); // Actualizar los folios con la data recibida
                setTotalPages(response.data.last_page); // Actualizar el número total de páginas
                setLoading(false);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error al obtener los folios');
                setLoading(false);
            }
        };

        if (user.id !== undefined) {
            fetchFolios();
        }
    }, [user, currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // Actualizar la página actual al hacer clic en una página
    };

    return (
        <>
            <Navbar />
            <div className="container mt-3 mb-5">
                {loading ? (
                    <p>Cargando...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <>
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            {folios.map((folio, index) => (
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
                                        <div className="card-footer text-muted">
                                            Estado: <span className="badge bg-primary">{folio.estado}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Paginación */}
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
                    </>
                )}
            </div>
        </>
    );
};

export default Folios;
