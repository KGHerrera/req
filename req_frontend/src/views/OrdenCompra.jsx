import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../context/contextprovider';
import Navbar from '../components/Navbar';
import axiosClient from '../axiosClient';
import Swal from 'sweetalert2';
import { FaUser, FaCalendarAlt, FaPercentage, FaDollarSign } from 'react-icons/fa';
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

    return (
        <>
            <Navbar />
            <div className="container mt-3 mb-5">

                {/* Mostrar datos del folio */}
                {folio && (
                    <div className="row mb-3 ">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header d-flex align-items-center">
                                    <FaFolderOpen className="me-2" />
                                    Datos del Folio
                                </div>
                                <div className="card-body">
                                    <small><p><strong>Folio:</strong> {folio.folio}</p></small>
                                    <small><p><strong>Fecha de Solicitud:</strong> {folio.fecha_solicitud}</p></small>
                                    <small><p><strong>Fecha de Entrega:</strong> {folio.fecha_entrega}</p></small>
                                    <small><p><strong>Total Estimado:</strong> {folio.total_estimado}</p></small>
                                    <small><p><strong>Clave de Departamento:</strong> {folio.clave_departamento}</p></small>
                                    <small><p className="fw-bold">Requisiciones:</p></small>
                                    <table className="table table-striped">
                                        <thead>
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
                                                    <td>{requisicion.costo_estimado}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Agregar órdenes de compra */}
                <div className="row ">
                    <div className="col-12">
                        <div className="card mb-3 ">
                            <div className="card-header d-flex align-items-center">
                                <FaPlusSquare className="me-2" />
                                Agregar Orden de Compra
                            </div>


                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="id_requisicion" className="form-label">ID Requisición</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><FaIdCard /></span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="id_requisicion"
                                                name="id_requisicion"
                                                placeholder="ID Requisición"
                                                value={newOrdenCompra.id_requisicion}
                                                onChange={handleChangeOrdenCompra}
                                                required
                                            />
                                        </div>
                                        {errors.id_requisicion && <p className="text-danger small mb-0">{errors.id_requisicion}</p>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="precio_unitario" className="form-label">Precio Unitario</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><FaDollarSign /></span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="precio_unitario"
                                                name="precio_unitario"
                                                placeholder="Precio Unitario"
                                                value={newOrdenCompra.precio_unitario}
                                                onChange={handleChangeOrdenCompra}
                                                required
                                            />
                                        </div>
                                        {errors.precio_unitario && <p className="text-danger small mb-0">{errors.precio_unitario}</p>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="importe_parcial" className="form-label">Importe Parcial</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><FaCalculator /></span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="importe_parcial"
                                                name="importe_parcial"
                                                placeholder="Importe Parcial"
                                                value={newOrdenCompra.importe_parcial}
                                                onChange={handleChangeOrdenCompra}
                                                required
                                            />
                                        </div>
                                        {errors.importe_parcial && <p className="text-danger small mb-0">{errors.importe_parcial}</p>}
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary d-flex align-items-center float-end" onClick={addOrdenCompra}>
                                    <FaPlusSquare className="me-2" /> Agregar Orden de Compra
                                </button>
                                {errors.ordenes_compra && <p className="text-danger small mb-0">{errors.ordenes_compra}</p>}
                            </div>


                        </div>
                    </div>
                </div>

                {/* Mostrar órdenes de compra agregadas */}
                {ordenesCompra.length > 0 && (
                    <div className="row">
                        <div className="col-12">
                            <div className="card mb-3">
                                <div className="card-header">
                                    Órdenes de Compra Agregadas
                                </div>
                                <div className="card-body">

                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Requisición</th>
                                                <th scope="col">Precio Unitario</th>
                                                <th scope="col">Importe Parcial</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ordenesCompra.map((orden, index) => (
                                                <tr key={index}>
                                                    <td>{orden.id_requisicion}</td>
                                                    <td>{orden.precio_unitario}</td>
                                                    <td>{orden.importe_parcial}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>



                                </div>
                            </div>
                        </div>
                    </div>

                )}

                <div className="row">
                    <div className="col-12">
                        <div className="card mb-3">
                            <div className="card-header d-flex align-items-center">
                                <FaCheckSquare className="me-2" />
                                Datos de la Compra
                            </div>




                            <div className="card-body">
                                <form>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="proveedor" className="form-label">Proveedor</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><FaUser /></span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="proveedor"
                                                    name="proveedor"
                                                    placeholder="Nombre del proveedor"
                                                    value={compraData.proveedor}
                                                    onChange={(e) => setCompraData({ ...compraData, proveedor: e.target.value })}
                                                    required
                                                    maxLength="255"
                                                />
                                            </div>
                                            {errors.proveedor && <p className="text-danger small">{errors.proveedor}</p>}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="fecha_entrega" className="form-label">Fecha de Entrega</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><FaCalendarAlt /></span>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="fecha_entrega"
                                                    name="fecha_entrega"
                                                    value={compraData.fecha_entrega}
                                                    onChange={(e) => setCompraData({ ...compraData, fecha_entrega: e.target.value })}
                                                />
                                            </div>
                                            {errors.fecha_entrega && <p className="text-danger small">{errors.fecha_entrega}</p>}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="IVA" className="form-label">IVA</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><FaDollarSign /></span>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="IVA"
                                                    name="IVA"
                                                    placeholder="IVA ($)"
                                                    value={compraData.IVA}
                                                    onChange={(e) => setCompraData({ ...compraData, IVA: e.target.value })}
                                                />
                                            </div>
                                            {errors.IVA && <p className="text-danger small">{errors.IVA}</p>}
                                        </div>
                                    </div>

                                    {/* Nueva fila para el campo Total */}
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="total" className="form-label">Total</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><FaDollarSign /></span>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="total"
                                                    name="total"
                                                    placeholder="Total ($)"
                                                    value={compraData.total}
                                                    onChange={(e) => setCompraData({ ...compraData, total: e.target.value })}
                                                />
                                            </div>
                                            {errors.total && <p className="text-danger small">{errors.total}</p>}
                                        </div>
                                    </div>
                                </form>

                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary float-end d-flex align-items-center justify-content-center" onClick={handleSubmit} disabled={isLoading} style={{minWidth: '200px'}}>
                                        
                                        {isLoading ? 
                                        
                                        (<span className="spinner-border spinner-border-sm mt-1" role="status" aria-hidden="true"></span>)
                                        : 
                                        
                                        (<span><FaCheckSquare className="me-2" /> Crear orden de Compra</span>)
                                        }
                                    </button>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>


            </div>
        </>
    );
};

export default OrdenCompra;
