import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosClient from '../axiosClient';
import Swal from 'sweetalert2';

const Compra = () => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Función para obtener las compras
    const fetchCompras = async () => {
        try {
            const params = {
                page: currentPage,
            };
            if (searchTerm.trim() !== '') {
                params.search = searchTerm;
            }

            const response = await axiosClient.get('/ordenes-compra', { params });
            setCompras(response.data.data);
            setTotalPages(response.data.last_page);
            setLoading(false);
            setError(null);
            console.log(response.data.data);
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error al obtener las compras');
            setCompras([]);
            setTotalPages(1);
            setLoading(false);
        }
    };

    // Efecto para cargar las compras cuando cambia la página actual
    useEffect(() => {
        fetchCompras();
    }, [currentPage, searchTerm]);

    // Función para manejar el cambio de página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Función para manejar el cambio en el campo de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Función para enviar la búsqueda al servidor
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setCurrentPage(1);
        await fetchCompras();
    };

    const handleShowEvidence = async (evidenceUrl) => {
        // Reemplazar 'public' por 'storage' en la URL
        const modifiedUrl = evidenceUrl.replace('/public/', '/storage/');

        Swal.fire({
            imageUrl: modifiedUrl,
            imageAlt: 'Evidencia de Entrega',
            
            confirmButtonColor: "#325d88",
            confirmButtonText: 'Cerrar'
        });
    };


    // Función para manejar la subida de evidencia
    const handleUploadEvidence = (compraId) => {
        Swal.fire({
            title: 'Subir Evidencia',
            html: '<input type="file" id="fileInput" accept="image/*" class="form-control">',
            showCancelButton: true,
            confirmButtonText: 'Subir',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: "#325d88",
            preConfirm: () => {
                const fileInput = document.getElementById('fileInput');
                const file = fileInput.files[0];
                if (!file) {
                    Swal.showValidationMessage('Debes seleccionar un archivo');
                }
                return file;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('image', result.value);

                try {
                    await axiosClient.post(`/ordenes-compra/${compraId}/subir-evidencia`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    Swal.fire('Evidencia Subida', 'La evidencia ha sido subida correctamente', 'success');
                    fetchCompras(); // Actualizar la lista de compras después de subir la evidencia
                } catch (err) {
                    Swal.fire('Error', 'Hubo un problema al subir la evidencia', 'error');
                }
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
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <>
                        {compras.length > 0 ? (
                            <div className="row row-cols-1 row-cols-md-2 g-4">
                                {compras.map((compra) => (
                                    <div key={compra.no_orden_compra} className="col">
                                        <div className="card h-100">
                                            <div className="card-header">
                                                <p className='mb-0'> No. Orden de Compra: {compra.no_orden_compra}</p>
                                            </div>
                                            <div className="card-body">
                                                <small><p className='mb-2'><strong>Proveedor:</strong> {compra.proveedor}</p></small>
                                                <small><p className='mb-2'><strong>Fecha de Entrega:</strong> {compra.fecha_entrega}</p></small>
                                                <small><p className='mb-2'><strong>IVA:</strong> {compra.IVA}</p>     </small>
                                                <small><p className='mb-2'><strong>Total:</strong> {compra.total}</p>   </small>
                                                <small><p className='fw-bold mb-2' >Órdenes de Compra:</p> </small>
                                                <div className="table-responsive">
                                                    <table className="table small table-hover table-bordered">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Precio Unitario</th>
                                                                <th>Importe Parcial</th>
                                                                <th>ID Requisición</th>
                                                                <th>Evidencia</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {compra.ordenes_compra.map((orden) => (
                                                                <tr key={orden.id_compra}>
                                                                    <td>{orden.precio_unitario}</td>
                                                                    <td>{orden.importe_parcial}</td>
                                                                    <td>{orden.id_requisicion}</td>
                                                                    <td>
                                                                        {orden.evidencia_de_entrega ? (
                                                                            <button
                                                                                className="btn btn-outline-primary btn-sm"
                                                                                onClick={() => handleShowEvidence("http://127.0.0.1:8000/" + orden.evidencia_de_entrega)}
                                                                            >
                                                                                Ver Evidencia
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                className="btn btn-outline-primary btn-sm"
                                                                                onClick={() => handleUploadEvidence(orden.id_compra)}
                                                                            >
                                                                                Agregar
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No se encontraron compras.</p>
                        )}
                        {compras.length > 0 && (
                            <nav aria-label="Page navigation example">
                                <p className="text-center mt-3">Total de compras: {compras.length}</p>
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

export default Compra;
