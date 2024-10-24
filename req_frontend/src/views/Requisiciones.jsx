import React, { useEffect, useState } from 'react';
import axiosClient from '../axiosClient'; // Importa tu cliente axios configurado
import { useStateContext } from '../context/contextprovider';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import { Navigate} from "react-router-dom"

const Requisiciones = () => {
    const { user } = useStateContext();
    const year = new Date().getFullYear();

    const [errors, setErrors] = useState({});



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
            });
    };



    return (
        <>

            <Navbar></Navbar>
            <div className="container mt-3 mb-5">
                <div className="row">
                    <div className="col-12">
                        <div className="card mb-3">
                            <div className="card-header">
                                Añadir Requisición
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="partida_presupuestal" className="form-label">Partida Presupuestal</label>
                                        <input type="text" className="form-control" id="partida_presupuestal" name="partida_presupuestal" value={newRequisicion.partida_presupuestal} onChange={handleChangeRequisicion} required maxLength="6" />
                                        {errors.partida_presupuestal && <p className="text-danger small mb-0">{errors.partida_presupuestal}</p>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="cantidad" className="form-label">Cantidad</label>
                                        <input type="number" className="form-control" id="cantidad" name="cantidad" value={newRequisicion.cantidad} onChange={handleChangeRequisicion} required />
                                        {errors.cantidad && <p className="text-danger small mb-0">{errors.cantidad}</p>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="unidad" className="form-label">Unidad</label>
                                        <input type="text" className="form-control" id="unidad" name="unidad" value={newRequisicion.unidad} onChange={handleChangeRequisicion} required maxLength="20" />
                                        {errors.unidad && <p className="text-danger small mb-0">{errors.unidad}</p>}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="descripcion_bienes_servicios" className="form-label">Descripción</label>
                                        <input type="text" className="form-control" id="descripcion_bienes_servicios" name="descripcion_bienes_servicios" value={newRequisicion.descripcion_bienes_servicios} onChange={handleChangeRequisicion} required maxLength="100" />
                                        {errors.descripcion_bienes_servicios && <p className="text-danger small mb-0">{errors.descripcion_bienes_servicios}</p>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="costo_estimado" className="form-label">Costo Estimado</label>
                                        <input type="number" className="form-control" id="costo_estimado" name="costo_estimado" value={newRequisicion.costo_estimado} onChange={handleChangeRequisicion} required />
                                        {errors.costo_estimado && <p className="text-danger small mb-0">{errors.costo_estimado}</p>}
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary btn-block float-end mb-3" onClick={addRequisicion}>Añadir Requisición</button>

                            </div>
                        </div>
                    </div>
                </div>


                <div className="row">
                    <div className="col-12">
                        <div className="card mb-3">
                            <div className="card-header">
                                Requisiciones Agregadas
                            </div>
                            <div className="card-body">
                                {requisiciones.length > 0 &&
                                    <table className="table table-striped">
                                        <thead>
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
                                                    <td>{req.costo_estimado}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }

                                {errors.requisiciones && <p className="text-danger small mb-0">{errors.requisiciones}</p>}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row">
                    <div className="col-12">
                        <div className="card mb-3">
                            <div className="card-header">
                                Información del Folio
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="folio" className="form-label">Folio</label>
                                            <input type="text" className="form-control" id="folio" name="folio" value={folioData.folio} readOnly />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="fecha_solicitud" className="form-label">Fecha de Solicitud</label>
                                            <input type="date" className="form-control" id="fecha_solicitud" name="fecha_solicitud" value={folioData.fecha_solicitud} readOnly />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="fecha_entrega" className="form-label">Fecha de Entrega estimada</label>
                                            <input type="date" className="form-control" id="fecha_entrega" name="fecha_entrega" value={folioData.fecha_entrega} readOnly />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="total_estimado" className="form-label">Total Estimado</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="total_estimado"
                                                name="total_estimado"
                                                value={folioData.total_estimado}
                                                onChange={(e) => setFolioData({ ...folioData, total_estimado: e.target.value })}
                                                min="0"
                                                onInvalid={(e) => e.target.setCustomValidity('Por favor, ingrese un costo estimado válido.')}
                                                onInput={(e) => e.target.setCustomValidity('')}
                                            />
                                            {errors.total_estimado && <p className="text-danger small mb-0">{errors.total_estimado}</p>}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="estado" className="form-label">Estado</label>
                                            <input type="text" className="form-control" id="estado" name="estado" value={folioData.estado} readOnly />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="clave_departamento" className="form-label">Clave de Departamento</label>
                                            <input type="text" className="form-control" id="clave_departamento" name="clave_departamento" value={folioData.clave_departamento} readOnly />
                                        </div>
                                    </div>
                                </form>
                                <button type="submit" className="btn btn-primary float-end" onClick={handleSubmit}>Enviar folio y requisiciones</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>

    );
};

export default Requisiciones;
