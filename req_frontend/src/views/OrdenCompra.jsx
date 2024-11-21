import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../context/contextprovider';
import Navbar from '../components/Navbar';
import axiosClient from '../axiosClient';
import Swal from 'sweetalert2';
import { FaUser, FaCalendarAlt, FaDollarSign, FaTrashAlt, FaInfoCircle } from 'react-icons/fa';
import { FaIdCard, FaCalculator } from 'react-icons/fa';

import { FaCheckSquare, FaFolderOpen, FaPlusSquare } from 'react-icons/fa';

const OrdenCompra = () => {
    const { user } = useStateContext();
    const location = useLocation();
    const [errors, setErrors] = useState({});
    const { folio } = location.state || {}; // Recuperar los datos del folio del estado de navegación

    const [isLoading, setIsLoading] = useState(false);
    const [compraData, setCompraData] = useState({
        proveedor: '',
        fecha_entrega: '',
        IVA: '',
        total: ''
    });

    const [ordenesCompra, setOrdenesCompra] = useState([]);
    const [newOrdenCompra, setNewOrdenCompra] = useState({
        id_requisicion: '',
        precio_unitario: '',
        importe_parcial: ''
    });

    useEffect(() => {
        if (user.id !== undefined) {
            const fechaOrden = new Date().toISOString().substr(0, 10);

            setCompraData({
                proveedor: '',
                fecha_entrega: fechaOrden,
                IVA: '',
                total: ''
            });
        }
    }, [user]);

    const handleChangeOrdenCompra = (e) => {
        setNewOrdenCompra({
            ...newOrdenCompra,
            [e.target.name]: e.target.value
        });
    };

    const addOrdenCompra = () => {
        const errors = {};

        if (newOrdenCompra.id_requisicion === '') {
            errors.id_requisicion = 'Por favor, selecciona una requisición';
        }

        if (newOrdenCompra.precio_unitario === '') {
            errors.precio_unitario = 'Por favor, ingresa el precio unitario';
        }

        if (newOrdenCompra.importe_parcial === '') {
            errors.importe_parcial = 'Por favor, ingresa el importe parcial';
        }

        if (isNaN(newOrdenCompra.precio_unitario)) {
            errors.precio_unitario = 'Por favor, ingresa un valor numérico para el precio unitario';
        }

        if (isNaN(newOrdenCompra.importe_parcial)) {
            errors.importe_parcial = 'Por favor, ingresa un valor numérico para el importe parcial';
        }

        setErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }

        setOrdenesCompra([...ordenesCompra, newOrdenCompra]);

        setNewOrdenCompra({
            id_requisicion: '',
            precio_unitario: '',
            importe_parcial: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();



        const _errors = {};

        if (compraData.proveedor === '') {
            _errors.proveedor = 'Por favor, ingresa el proveedor';
        }

        if (compraData.IVA === '') {
            _errors.IVA = 'Por favor, ingresa el IVA';
        }

        if (compraData.total === '') {
            _errors.total = 'Por favor, ingresa el total';
        }

        if (compraData.fecha_entrega === '') {
            _errors.fecha_entrega = 'Por favor, ingresa la fecha de entrega';
        }

        const data = {
            ...compraData,
            ordenes_compra: ordenesCompra
        };

        if (ordenesCompra.length === 0) {
            _errors.ordenes_compra = 'Por favor, agrega al menos una orden de compra';
        }

        if (Object.keys(_errors).length > 0) {
            setErrors(_errors);
            return;
        }

        setIsLoading(true);

        console.log(compraData);

        axiosClient.post('/orden-compra', data)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Compra y órdenes de compra creadas con éxito',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    setCompraData({
                        proveedor: '',
                        fecha_entrega: '',
                        IVA: '',
                        total: ''
                    });
                    setOrdenesCompra([]);
                    setNewOrdenCompra({
                        id_requisicion: '',
                        precio_unitario: '',
                        importe_parcial: ''
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
                setIsLoading(false);
            });
    };


    const deleteCompra = (index) => {
        setOrdenesCompra(ordenesCompra.filter((_, i) => i !== index));
    };

    return (
        <>
            <Navbar />
            <div className="container py-4">
                {/* Datos del Folio */}
                {folio && (
                    <div className="row g-4 mb-4">
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-header bg-light py-3 d-flex align-items-center">
                                    <FaFolderOpen className="me-2" />
                                    <h5 className="mb-0">Datos del Folio</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-2">
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center">
                                                <small><span className="fw-bold me-2">Folio:</span>
                                                    <span>{folio.folio}</span></small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center">
                                                <small><span className="fw-bold me-2">Fecha de Solicitud:</span>
                                                    <span>{folio.fecha_solicitud}</span></small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center">
                                                <small> <span className="fw-bold me-2">Fecha de Entrega:</span>
                                                    <span>{folio.fecha_entrega}</span></small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center">
                                                <small><span className="fw-bold me-2">Total Estimado:</span>
                                                    <span>${folio.total_estimado}</span></small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center">
                                                <small> <span className="fw-bold me-2">Clave de Departamento:</span>
                                                    <span>{folio.clave_departamento}</span></small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <small><p className="fw-bold mb-3">Requisiciones:</p></small>
                                        <div className="table-responsive">
                                            <table className="table table-hover table-bordered align-middle small">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th scope="col">ID</th>
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
                                                            <td>{requisicion.id_requisicion}</td>
                                                            <td>{requisicion.partida_presupuestal}</td>
                                                            <td>{requisicion.cantidad}</td>
                                                            <td>{requisicion.unidad}</td>
                                                            <td>{requisicion.descripcion_bienes_servicios}</td>
                                                            <td>${requisicion.costo_estimado}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                    {/* Lo demas */}

                                    <h5 className='mt-4'>
                                        <FaPlusSquare className="me-2" />
                                        Agregar Orden de Compra
                                    </h5>

                                    <form className='mt-4'>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <div className="form-floating">
                                                    <select
                                                        className={`form-control ${errors.id_requisicion ? 'is-invalid' : ''}`}
                                                        id="id_requisicion"
                                                        name="id_requisicion"
                                                        value={newOrdenCompra.id_requisicion}
                                                        onChange={handleChangeOrdenCompra}
                                                        required
                                                        aria-describedby="idRequisicionHelp"
                                                    >
                                                        <option value="" disabled>
                                                            Selecciona una requisición
                                                        </option>
                                                        {folio.requisiciones.map((requisicion, reqIndex) => (
                                                            <option key={reqIndex} value={requisicion.id_requisicion}>
                                                                {requisicion.id_requisicion}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <label htmlFor="id_requisicion">
                                                        <FaIdCard className="me-2" />
                                                        ID Requisición
                                                    </label>
                                                    <small id="idRequisicionHelp" className="form-text text-muted">
                                                        ID de la requisición en la parte superior
                                                    </small>
                                                    {errors.id_requisicion &&
                                                        <div className="invalid-feedback">{errors.id_requisicion}</div>
                                                    }
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-floating">
                                                    <input
                                                        type="number"
                                                        className={`form-control ${errors.precio_unitario ? 'is-invalid' : ''}`}
                                                        id="precio_unitario"
                                                        name="precio_unitario"
                                                        placeholder="Precio Unitario"
                                                        value={newOrdenCompra.precio_unitario}
                                                        onChange={handleChangeOrdenCompra}
                                                        required
                                                        aria-describedby="precioUnitarioHelp"
                                                    />
                                                    <label htmlFor="precio_unitario">
                                                        <FaDollarSign className="me-2" />
                                                        Precio Unitario
                                                    </label>
                                                    <small id="precioUnitarioHelp" className="form-text text-muted">
                                                        Costo por unidad
                                                    </small>
                                                    {errors.precio_unitario &&
                                                        <div className="invalid-feedback">{errors.precio_unitario}</div>
                                                    }
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-floating">
                                                    <input
                                                        type="number"
                                                        className={`form-control ${errors.importe_parcial ? 'is-invalid' : ''}`}
                                                        id="importe_parcial"
                                                        name="importe_parcial"
                                                        placeholder="Importe Parcial"
                                                        value={newOrdenCompra.importe_parcial}
                                                        onChange={handleChangeOrdenCompra}
                                                        required
                                                        aria-describedby="importeParcialHelp"
                                                    />
                                                    <label htmlFor="importe_parcial">
                                                        <FaCalculator className="me-2" />
                                                        Importe Parcial
                                                    </label>
                                                    <small id="importeParcialHelp" className="form-text text-muted">
                                                        Importe parcial de la orden de compra
                                                    </small>
                                                    {errors.importe_parcial &&
                                                        <div className="invalid-feedback">{errors.importe_parcial}</div>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-end mt-4">
                                            <button
                                                type="button"
                                                className="btn btn-primary d-flex align-items-center"
                                                onClick={addOrdenCompra}
                                            >
                                                <FaPlusSquare className="me-2" />
                                                Agregar Orden de Compra
                                            </button>
                                        </div>

                                        {errors.ordenes_compra && (
                                            <div className="alert alert-danger mt-3" role="alert">
                                                {errors.ordenes_compra}
                                            </div>
                                        )}


                                    </form>

                                    {/* Órdenes de Compra Agregadas */}
                                    {ordenesCompra.length > 0 && (
                                        <div className="table-responsive mt-4">
                                            <small><p className=' fw-bold'>Ordenes de Compra Agregadas</p></small>
                                            <table className="table table-hover table-bordered small align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th scope="col">Requisición</th>
                                                        <th scope="col">Precio Unitario</th>
                                                        <th scope="col">Importe Parcial</th>
                                                        <th scope="col">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ordenesCompra.map((orden, index) => (
                                                        <tr key={index}>
                                                            <td>{orden.id_requisicion}</td>
                                                            <td>${orden.precio_unitario}</td>
                                                            <td>${orden.importe_parcial}</td>
                                                            <td className='text-center'>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => deleteCompra(index)}
                                                                >
                                                                    <FaTrashAlt className="me-2" />
                                                                    Eliminar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}


                                    <h5 className='mt-4'>
                                        <FaCheckSquare className="me-2" />
                                        Datos de la Compra
                                    </h5>
                                    <form className="mt-4">
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <div className="form-floating">
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.proveedor ? 'is-invalid' : ''}`}
                                                        id="proveedor"
                                                        name="proveedor"
                                                        placeholder="Nombre del proveedor"
                                                        value={compraData.proveedor}
                                                        onChange={(e) => setCompraData({ ...compraData, proveedor: e.target.value })}
                                                        maxLength="255"
                                                        required
                                                        aria-describedby="proveedorHelp"
                                                    />
                                                    <label htmlFor="proveedor">
                                                        <FaUser className="me-2" />
                                                        Proveedor
                                                    </label>
                                                    <small id="proveedorHelp" className="form-text text-muted">
                                                        Nombre del proveedor
                                                    </small>
                                                    {errors.proveedor &&
                                                        <div className="invalid-feedback">{errors.proveedor}</div>
                                                    }
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-floating">
                                                    <input
                                                        type="date"
                                                        className={`form-control ${errors.fecha_entrega ? 'is-invalid' : ''}`}
                                                        id="fecha_entrega"
                                                        name="fecha_entrega"
                                                        value={compraData.fecha_entrega}
                                                        onChange={(e) => setCompraData({ ...compraData, fecha_entrega: e.target.value })}
                                                        aria-describedby="fechaEntregaHelp"
                                                    />
                                                    <label htmlFor="fecha_entrega">
                                                        <FaCalendarAlt className="me-2" />
                                                        Fecha de Entrega
                                                    </label>
                                                    <small id="fechaEntregaHelp" className="form-text text-muted">
                                                        Fecha en la que se hará la entrega
                                                    </small>
                                                    {errors.fecha_entrega &&
                                                        <div className="invalid-feedback">{errors.fecha_entrega}</div>
                                                    }
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-floating">
                                                    <input
                                                        type="number"
                                                        className={`form-control ${errors.IVA ? 'is-invalid' : ''}`}
                                                        id="IVA"
                                                        name="IVA"
                                                        placeholder="IVA ($)"
                                                        value={compraData.IVA}
                                                        onChange={(e) => setCompraData({ ...compraData, IVA: e.target.value })}
                                                        aria-describedby="IVAHelp"
                                                    />
                                                    <label htmlFor="IVA">
                                                        <FaDollarSign className="me-2" />
                                                        IVA
                                                    </label>
                                                    <small id="IVAHelp" className="form-text text-muted">
                                                        IVA en pesos
                                                    </small>
                                                    {errors.IVA &&
                                                        <div className="invalid-feedback">{errors.IVA}</div>
                                                    }
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-floating">
                                                    <input
                                                        type="number"
                                                        className={`form-control ${errors.total ? 'is-invalid' : ''}`}
                                                        id="total"
                                                        name="total"
                                                        placeholder="Total ($)"
                                                        value={compraData.total}
                                                        onChange={(e) => setCompraData({ ...compraData, total: e.target.value })}
                                                        aria-describedby="totalHelp"
                                                    />
                                                    <label htmlFor="total">
                                                        <FaDollarSign className="me-2" />
                                                        Total
                                                    </label>
                                                    <small id="totalHelp" className="form-text text-muted">
                                                        Total de la orden de compra
                                                    </small>
                                                    {errors.total &&
                                                        <div className="invalid-feedback">{errors.total}</div>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-end mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary d-flex align-items-center"
                                                onClick={handleSubmit}
                                                disabled={isLoading}
                                                style={{ minWidth: '200px' }}
                                            >
                                                {isLoading ? (
                                                    <div className="spinner-border spinner-border-sm mx-auto" role="status">
                                                        <span className="visually-hidden">Cargando...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <FaCheckSquare className="me-2" />
                                                        Crear Orden de Compra
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>


                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </>
    );

};

export default OrdenCompra;
