import React, { useEffect, useState } from 'react';
import axiosClient from '../axiosClient'; // Importa tu cliente axios configurado
import { useStateContext } from '../context/contextprovider';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

import { FaClipboardList, FaCalculator, FaRulerCombined, FaRegFileAlt, FaDollarSign } from 'react-icons/fa'
import { FaPlusSquare, FaPaperPlane } from 'react-icons/fa';
import { FaCalendarAlt, FaIdBadge, FaKey } from 'react-icons/fa';

const Requisiciones = () => {
    const { user } = useStateContext();
    const year = new Date().getFullYear();

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);



    const [folioData, setFolioData] = useState({
        folio: '',
        fecha_solicitud: '',
        fecha_entrega: '',
        total_estimado: '',
        estado: 'enviada',
        clave_departamento: '',
        user_id: ''
    });

    useEffect(() => {

        if (user.clave_departamento !== undefined) {
            const fechaSolicitud = new Date();
            const fechaEntrega = new Date(fechaSolicitud);
            fechaEntrega.setDate(fechaEntrega.getDate() + 10);

            setFolioData({
                folio: `${user.clave_departamento}${year}-00`,
                fecha_solicitud: fechaSolicitud.toISOString().substr(0, 10),
                fecha_entrega: fechaEntrega.toISOString().substr(0, 10),
                total_estimado: '',
                estado: 'enviada',
                clave_departamento: user.clave_departamento,
                user_id: user.id
            });
        }
    }, [user, year]);

    const [requisiciones, setRequisiciones] = useState([]);
    const [newRequisicion, setNewRequisicion] = useState({
        partida_presupuestal: '',
        cantidad: '',
        unidad: '',
        descripcion_bienes_servicios: '',
        costo_estimado: ''
    });

    const handleChangeRequisicion = (e) => {
        setNewRequisicion({
            ...newRequisicion,
            [e.target.name]: e.target.value
        });
    };

    const addRequisicion = () => {
        const errors = {};

        // Validación de campos requeridos o condiciones específicas
        if (newRequisicion.partida_presupuestal === '') {
            errors.partida_presupuestal = 'Por favor, ingresa la partida presupuestal';
        }

        if (newRequisicion.cantidad === '') {
            errors.cantidad = 'Por favor, ingresa la cantidad';
        }

        if (newRequisicion.unidad === '') {
            errors.unidad = 'Por favor, ingresa la unidad';
        }

        if (newRequisicion.descripcion_bienes_servicios === '') {
            errors.descripcion_bienes_servicios = 'Por favor, ingresa la descripción de bienes o servicios';
        }

        if (newRequisicion.costo_estimado === '') {
            errors.costo_estimado = 'Por favor, ingresa el costo estimado';
        }

        // Validación de tipo numérico para costo estimado
        if (isNaN(newRequisicion.costo_estimado)) {
            errors.costo_estimado = 'Por favor, ingresa un valor numérico para el costo estimado';
        }

        // Si hay errores, los establecemos en el estado y no agregamos la requisición
        setErrors(errors);
        if (Object.keys(errors).length > 0) {

            return;
        }

        // Si no hay errores, agregamos la nueva requisición a la lista
        setRequisiciones([...requisiciones, newRequisicion]);

        // Limpiamos el estado de newRequisicion para el siguiente ingreso
        setNewRequisicion({
            partida_presupuestal: '',
            cantidad: '',
            unidad: '',
            descripcion_bienes_servicios: '',
            costo_estimado: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const _errors = {};

        const data = {
            ...folioData,
            requisiciones: requisiciones
        };

        if (folioData.total_estimado === '') {
            _errors.total_estimado = 'Por favor, ingresa un valor para el total estimado';
        }

        // Validación de tipo numérico para total estimado
        if (isNaN(folioData.total_estimado)) {
            _errors.total_estimado = 'Por favor, ingresa un valor numérico para el total estimado';
        }

        // Validación de requisiciones
        if (requisiciones.length === 0) {
            _errors.requisiciones = 'Por favor, agrega al menos una requisición';
        }

        if (Object.keys(_errors).length > 0) {
            setErrors(_errors);
            return;
        }

        setLoading(true);

        axiosClient.post('/folio-requisicion', data)
            .then(() => {

                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Folio y Requisiciones enviados con éxito',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    setFolioData({
                        ...folioData,
                        total_estimado: '',
                        estado: 'enviada'
                    });
                    setRequisiciones([]);
                    setNewRequisicion({
                        partida_presupuestal: '',
                        cantidad: '',
                        unidad: '',
                        descripcion_bienes_servicios: '',
                        costo_estimado: ''
                    });
                    setErrors({});
                });
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            }).finally(() => {
                setLoading(false);
            });
    };



    return (
        <>
            <Navbar />
            <div className="container py-4">
                {/* Formulario de Requisición */}
                <div className="row g-4">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white d-flex align-items-center">
                                <FaPlusSquare className="me-2" />
                                <h5 className="mb-0">Añadir Requisición</h5>
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.partida_presupuestal ? 'is-invalid' : ''}`}
                                                    id="partida_presupuestal"
                                                    name="partida_presupuestal"
                                                    placeholder="000000"
                                                    value={newRequisicion.partida_presupuestal}
                                                    onChange={handleChangeRequisicion}
                                                    maxLength="6"
                                                    required
                                                    aria-describedby="partidaPresupuestalHelp"
                                                />
                                                <label htmlFor="partida_presupuestal">
                                                    <FaClipboardList className="me-2" />
                                                    Partida Presupuestal
                                                </label>
                                                <small id="partidaPresupuestalHelp" className="form-text text-muted">
                                                    Debe ser un valor numérico, ej. (200022)
                                                </small>
                                                {errors.partida_presupuestal &&
                                                    <div className="invalid-feedback">{errors.partida_presupuestal}</div>
                                                }
                                            </div>
                                        </div>
    
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    className={`form-control ${errors.cantidad ? 'is-invalid' : ''}`}
                                                    id="cantidad"
                                                    name="cantidad"
                                                    placeholder="0"
                                                    value={newRequisicion.cantidad}
                                                    onChange={handleChangeRequisicion}
                                                    required
                                                    aria-describedby="cantidadHelp"
                                                />
                                                <label htmlFor="cantidad">
                                                    <FaCalculator className="me-2" />
                                                    Cantidad
                                                </label>
                                                <small id="cantidadHelp" className="form-text text-muted">
                                                    Debe ser un valor numérico
                                                </small>
                                                {errors.cantidad &&
                                                    <div className="invalid-feedback">{errors.cantidad}</div>
                                                }
                                            </div>
                                        </div>
    
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.unidad ? 'is-invalid' : ''}`}
                                                    id="unidad"
                                                    name="unidad"
                                                    placeholder="pieza, litro, etc"
                                                    value={newRequisicion.unidad}
                                                    onChange={handleChangeRequisicion}
                                                    maxLength="20"
                                                    required
                                                    aria-describedby="unidadHelp"
                                                />
                                                <label htmlFor="unidad">
                                                    <FaRulerCombined className="me-2" />
                                                    Unidad
                                                </label>
                                                <small id="unidadHelp" className="form-text text-muted">
                                                    Como por ejemplo pieza, litro, etc.
                                                </small>
                                                {errors.unidad &&
                                                    <div className="invalid-feedback">{errors.unidad}</div>
                                                }
                                            </div>
                                        </div>
    
                                        <div className="col-md-8">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.descripcion_bienes_servicios ? 'is-invalid' : ''}`}
                                                    id="descripcion_bienes_servicios"
                                                    name="descripcion_bienes_servicios"
                                                    placeholder="descripción detallada del bien o servicio"
                                                    value={newRequisicion.descripcion_bienes_servicios}
                                                    onChange={handleChangeRequisicion}
                                                    maxLength="100"
                                                    required
                                                    aria-describedby="descripcionHelp"
                                                />
                                                <label htmlFor="descripcion_bienes_servicios">
                                                    <FaRegFileAlt className="me-2" />
                                                    Descripción
                                                </label>
                                                <small id="descripcionHelp" className="form-text text-muted">
                                                    Descripción detallada del bien o servicio.
                                                </small>
                                                {errors.descripcion_bienes_servicios &&
                                                    <div className="invalid-feedback">{errors.descripcion_bienes_servicios}</div>
                                                }
                                            </div>
                                        </div>
    
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    className={`form-control ${errors.costo_estimado ? 'is-invalid' : ''}`}
                                                    id="costo_estimado"
                                                    name="costo_estimado"
                                                    placeholder="0.00"
                                                    value={newRequisicion.costo_estimado}
                                                    onChange={handleChangeRequisicion}
                                                    required
                                                    aria-describedby="costoEstimadoHelp"
                                                />
                                                <label htmlFor="costo_estimado">
                                                    <FaDollarSign className="me-2" />
                                                    Costo Estimado
                                                </label>
                                                <small id="costoEstimadoHelp" className="form-text text-muted">
                                                    Total del costo del los bienes o servicios
                                                </small>
                                                {errors.costo_estimado &&
                                                    <div className="invalid-feedback">{errors.costo_estimado}</div>
                                                }
                                            </div>
                                        </div>
                                    </div>
    
                                    <div className="d-flex justify-content-end mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-primary d-flex align-items-center"
                                            onClick={addRequisicion}
                                        >
                                            <FaPlusSquare className="me-2" />
                                            Añadir Requisición
                                        </button>
                                    </div>
                                </form>
    
                                {requisiciones.length > 0 && (
                                    <div className="table-responsive mt-4">
                                        <table className="table table-hover table-bordered small">
                                            <thead className="table-light">
                                                <tr>
                                                    <th scope="col">Partida Presupuestal</th>
                                                    <th scope="col">Cantidad</th>
                                                    <th scope="col">Unidad</th>
                                                    <th scope="col">Descripción</th>
                                                    <th scope="col">Costo Estimado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {requisiciones.map((req, index) => (
                                                    <tr key={index}>
                                                        <td>{req.partida_presupuestal}</td>
                                                        <td>{req.cantidad}</td>
                                                        <td>{req.unidad}</td>
                                                        <td>{req.descripcion_bienes_servicios}</td>
                                                        <td>${req.costo_estimado}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
    
                                {errors.requisiciones && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {errors.requisiciones}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
    
                    {/* Información del Folio */}
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">Información del Folio</h5>
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="folio"
                                                    value={folioData.folio}
                                                    readOnly
                                                />
                                                <label htmlFor="folio">
                                                    <FaIdBadge className="me-2" />
                                                    Folio
                                                </label>
                                            </div>
                                        </div>
    
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="fecha_solicitud"
                                                    value={folioData.fecha_solicitud}
                                                    readOnly
                                                />
                                                <label htmlFor="fecha_solicitud">
                                                    <FaCalendarAlt className="me-2" />
                                                    Fecha de Solicitud
                                                </label>
                                            </div>
                                        </div>
    
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="fecha_entrega"
                                                    value={folioData.fecha_entrega}
                                                    readOnly
                                                />
                                                <label htmlFor="fecha_entrega">
                                                    <FaCalendarAlt className="me-2" />
                                                    Fecha de Entrega estimada
                                                </label>
                                            </div>
                                        </div>
    
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    className={`form-control ${errors.total_estimado ? 'is-invalid' : ''}`}
                                                    id="total_estimado"
                                                    name="total_estimado"
                                                    placeholder="0.00"
                                                    value={folioData.total_estimado}
                                                    onChange={(e) => setFolioData({ ...folioData, total_estimado: e.target.value })}
                                                    min="0"
                                                    aria-describedby="totalEstimadoHelp"
                                                />
                                                <label htmlFor="total_estimado">
                                                    <FaDollarSign className="me-2" />
                                                    Total Estimado
                                                </label>
                                                <small id="totalEstimadoHelp" className="form-text text-muted">
                                                    Total de todas las requisiciones
                                                </small>
                                                {errors.total_estimado &&
                                                    <div className="invalid-feedback">{errors.total_estimado}</div>
                                                }
                                            </div>
                                        </div>
    
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="estado"
                                                    value={folioData.estado}
                                                    readOnly
                                                />
                                                <label htmlFor="estado">
                                                    <FaKey className="me-2" />
                                                    Estado
                                                </label>
                                            </div>
                                        </div>
    
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="clave_departamento"
                                                    value={folioData.clave_departamento}
                                                    readOnly
                                                />
                                                <label htmlFor="clave_departamento">
                                                    <FaKey className="me-2" />
                                                    Clave de Departamento
                                                </label>
                                            </div>
                                        </div>
                                    </div>
    
                                    <div className="d-flex justify-content-end mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary d-flex align-items-center"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            style={{ minWidth: '200px' }}
                                        >
                                            {loading ? (
                                                <div className="spinner-border spinner-border-sm mx-auto" role="status">
                                                    <span className="visually-hidden">Cargando...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <FaPaperPlane className="me-2" />
                                                    Enviar al folio
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    
};

export default Requisiciones;
