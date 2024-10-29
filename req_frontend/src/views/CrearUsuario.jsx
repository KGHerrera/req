import React, { useState } from 'react';
import axiosClient from '../axiosClient';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import { FaPlusSquare, FaUser, FaEnvelope, FaKey, FaBuilding, FaUserTag } from 'react-icons/fa';
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

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const request = userData.id
            ? axiosClient.put(`/users/${userData.id}`, userData)
            : axiosClient.post('/users', userData);
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
            });
    };

    const handleEdit = (user) => {
        setUserData({
            ...user,
            password: '',
            password_confirmation: ''
        });
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5 mb-5">
                <div className="row">
                    <div className="col-12">
                        <div className="card mb-3">
                            <div className="card-header d-flex align-items-center">
                                <FaPlusSquare className="me-1" /> {userData.id ? 'Editar Usuario' : 'Crear Usuario'}
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="name" className="form-label">Nombre</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><FaUser /></span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="name"
                                                    name="name"
                                                    value={userData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            {errors.name && <p className="text-danger small mb-0">{errors.name[0]}</p>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><FaEnvelope /></span>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    value={userData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            {errors.email && <p className="text-danger small mb-0">{errors.email[0]}</p>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="rol" className="form-label">Rol</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><FaUserTag /></span>
                                                <select
                                                    className="form-control"
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
                                            </div>
                                            {errors.rol && <p className="text-danger small mb-0">{errors.rol[0]}</p>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="clave_departamento" className="form-label">Clave de Departamento</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><FaBuilding /></span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="clave_departamento"
                                                    name="clave_departamento"
                                                    value={userData.clave_departamento}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            {errors.clave_departamento && <p className="text-danger small mb-0">{errors.clave_departamento[0]}</p>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="password" className="form-label">Contraseña</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><FaKey /></span>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    name="password"
                                                    value={userData.password}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errors.password && <p className="text-danger small mb-0">{errors.password[0]}</p>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="password_confirmation" className="form-label">Confirmar Contraseña</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><FaKey /></span>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    value={userData.password_confirmation}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errors.password_confirmation && <p className="text-danger small mb-0">{errors.password_confirmation[0]}</p>}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary float-end">{userData.id ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
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
