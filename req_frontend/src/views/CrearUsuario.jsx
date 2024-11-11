import React, { useState, useRef } from 'react';
import axiosClient from '../axiosClient';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import { FaPlusSquare, FaUser, FaEnvelope, FaKey, FaBuilding, FaUserTag, FaUserPlus } from 'react-icons/fa';
import UserTable from '../components/UserTable';

const CrearUsuario = () => {
    const [userData, setUserData] = useState({
        id: null,
        name: '',
        email: '',
        rol: '',
        clave_departamento: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const nameRef = useRef();
    const emailRef = useRef();
    const claveDepartamentoRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const updatedUserData = {
            ...userData,
            clave_departamento: userData.clave_departamento.toUpperCase()
        };

        const request = updatedUserData.id
            ? axiosClient.put(`/users/${updatedUserData.id}`, updatedUserData)
            : axiosClient.post('/users', updatedUserData);



        request
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: userData.id ? 'Usuario actualizado' : 'Usuario creado con éxito',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    setUserData({
                        id: null,
                        name: '',
                        email: '',
                        rol: '',
                        clave_departamento: '',
                        password: '',
                        password_confirmation: ''
                    });
                    setErrors({});
                });
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleEdit = (user) => {
        setUserData({
            ...user,
            password: '',
            password_confirmation: ''
        });
    };


    const handleCancel = () => {
        setUserData({
            id: null,
            name: '',
            email: '',
            rol: '',
            clave_departamento: '',
            password: '',
            password_confirmation: ''
        });
        setErrors({});
        setShowForm(false);
    };



    return (
        <>
            <Navbar />
            <div className="container mt-4 mb-5">
                <div className="row">
                    <div className="col-12">
                        <div className="card mb-3">
                            <div className="card-header d-flex align-items-center">
                                <FaPlusSquare className="me-1" /> {userData.id ? 'Editar Usuario' : 'Crear Usuario'}
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-12 col-md-6 mb-4 form-group form-floating">
                                            <input
                                                ref={nameRef}
                                                type="text"
                                                className={`form-control ${errors?.name ? 'is-invalid' : ''}`}
                                                id="name"
                                                name="name"
                                                value={userData.name}
                                                onChange={handleChange}
                                                placeholder="Introduce tu nombre"
                                                required
                                            />
                                            <label htmlFor="name" className='ms-2'>
                                                <FaUser className="me-2" />
                                                Nombre
                                            </label>
                                            {errors?.name && (
                                                <div className="invalid-feedback">{errors.name[0]}</div>
                                            )}
                                            <small className="form-text text-muted">Nombre(s) y apellidos</small>
                                        </div>
                                        <div className="col-12 col-md-6 mb-4 form-group form-floating">
                                            <input
                                                ref={emailRef}
                                                type="email"
                                                className={`form-control ${errors?.email ? 'is-invalid' : ''}`}
                                                id="email"
                                                name="email"
                                                value={userData.email}
                                                onChange={handleChange}
                                                placeholder="Introduce tu correo electrónico"
                                                required
                                            />
                                            <label htmlFor="email" className='ms-2'>
                                                <FaEnvelope className="me-2" />
                                                Correo Electrónico
                                            </label>
                                            {errors?.email && (
                                                <div className="invalid-feedback">{errors.email[0]}</div>
                                            )}
                                            <small className="form-text text-muted">Ejemplo@gmail.com</small>
                                        </div>
                                        <div className="col-12 col-md-6 mb-4 form-group form-floating">
                                            <select
                                                className={`form-control ${errors?.rol ? 'is-invalid' : ''}`}
                                                id="rol"
                                                name="rol"
                                                value={userData.rol}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="" disabled>Seleccione un rol</option>
                                                <option value="user">user</option>
                                                <option value="financiero">financiero</option>
                                                <option value="vinculacion">vinculacion</option>
                                                <option value="direccion">direccion</option>
                                                <option value="materiales">materiales</option>
                                            </select>
                                            <label htmlFor="rol" className='ms-2'>
                                                <FaUserTag className="me-2" />
                                                Rol
                                            </label>
                                            {errors?.rol && (
                                                <div className="invalid-feedback">{errors.rol[0]}</div>
                                            )}
                                        </div>
                                        <div className="col-12 col-md-6 mb-4 form-group form-floating">
                                            <input
                                                ref={claveDepartamentoRef}
                                                type="text"
                                                className={`form-control ${errors?.clave_departamento ? 'is-invalid' : ''}`}
                                                id="clave_departamento"
                                                name="clave_departamento"
                                                value={userData.clave_departamento}
                                                onChange={handleChange}
                                                placeholder="Introduce tu clave de departamento"
                                                required
                                            />
                                            <label htmlFor="clave_departamento" className='ms-2'>
                                                <FaBuilding className="me-2" />
                                                Clave Departamento
                                            </label>
                                            {errors?.clave_departamento && (
                                                <div className="invalid-feedback">{errors.clave_departamento[0]}</div>
                                            )}
                                            <small className="form-text text-muted">Abreviado en tres letras mayúsculas.</small>
                                        </div>
                                        <div className="col-12 col-md-6 mb-4 form-group form-floating">
                                            <input
                                                ref={passwordRef}
                                                type="password"
                                                className={`form-control ${errors?.password ? 'is-invalid' : ''}`}
                                                id="password"
                                                name="password"
                                                value={userData.password}
                                                onChange={handleChange}
                                                placeholder="Introduce tu contraseña"
                                            />
                                            <label htmlFor="password" className='ms-2'>
                                                <FaKey className="me-2" />
                                                Contraseña
                                            </label>
                                            {errors?.password && (
                                                <div className="invalid-feedback">{errors.password[0]}</div>
                                            )}
                                            <small className="form-text text-muted">Mínimo 8 caracteres</small>
                                        </div>
                                        <div className="col-12 col-md-6  mb-4 form-group form-floating">
                                            <input
                                                ref={confirmPasswordRef}
                                                type="password"
                                                className={`form-control ${errors?.password_confirmation ? 'is-invalid' : ''}`}
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                value={userData.password_confirmation}
                                                onChange={handleChange}
                                                placeholder="Confirma tu contraseña"
                                            />
                                            <label htmlFor="password_confirmation" className='ms-2'>
                                                <FaKey className="me-2" />
                                                Confirmar Contraseña
                                            </label>
                                            {errors?.password_confirmation && (
                                                <div className="invalid-feedback">{errors.password_confirmation[0]}</div>
                                            )}
                                            <small className="form-text text-muted">Mínimo 8 caracteres, iguales a la anterior</small>
                                        </div>


                                    </div>

                                    <button type="submit" className={`btn btn-primary ${userData.id ? 'col-12' : 'col-12'} d-flex align-items-center justify-content-center hover-effect`} disabled={isLoading}>
                                        {isLoading ? (
                                            <span className="spinner-border spinner-border-sm mt-1" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <>
                                                <FaUserPlus className="me-2" /><span>{userData.id ? 'Actualizar Usuario' : 'Crear Usuario'}</span>
                                            </>
                                        )}
                                    </button>

                                    {userData.id &&
                                        <button type="button" className="btn btn-secondary mt-3 col-12" onClick={handleCancel}>Cancelar</button>
                                    }




                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <UserTable onEdit={handleEdit} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CrearUsuario;
