import React, { useState, useRef } from 'react';
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/contextprovider';
import { FaUser, FaEnvelope, FaKey, FaBuilding } from 'react-icons/fa';

const Register = () => {
    const { setUser, setToken } = useStateContext();
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const claveDepartamentoRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            rol: "user",
            clave_departamento: claveDepartamentoRef.current.value,
            password: passwordRef.current.value,
        };

        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            alert("Las contraseñas no coinciden");
            return;
        }

        axiosClient.post("/register", payload).then(({ data }) => {
            setUser(data.user);
            setToken(data.token);
        }).catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
                setErrors(response.data.errors);
            }
        });
    };

    return (
        <div className="container d-flex align-items-center min-vh-100">
            <div className="row justify-content-center w-100">
                <div className="col-md-8">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">Registro</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <label htmlFor="name" className="form-label">Nombre</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaUser /></span>
                                        <input ref={nameRef} type="text" className="form-control" id="name" placeholder="Introduce tu nombre" />
                                    </div>
                                    {errors.name && <p className="text-danger small mt-1">{errors.name[0]}</p>}
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaEnvelope /></span>
                                        <input ref={emailRef} type="email" className="form-control" id="email" placeholder="Introduce tu correo electrónico" />
                                    </div>
                                    {errors.email && <p className="text-danger small mt-1">{errors.email[0]}</p>}
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label htmlFor="claveDepartamento" className="form-label">Clave Departamento</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaBuilding /></span>
                                        <input ref={claveDepartamentoRef} type="text" className="form-control" id="claveDepartamento" placeholder="Introduce tu clave de departamento" />
                                    </div>
                                    {errors.clave_departamento && <p className="text-danger small mt-1">{errors.clave_departamento[0]}</p>}
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaKey /></span>
                                        <input ref={passwordRef} type="password" className="form-control" id="password" placeholder="Introduce tu contraseña" />
                                    </div>
                                    {errors.password && <p className="text-danger small mt-1">{errors.password[0]}</p>}
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaKey /></span>
                                        <input ref={confirmPasswordRef} type="password" className="form-control" id="confirmPassword" placeholder="Confirma tu contraseña" />
                                    </div>
                                    {errors.password && <p className="text-danger small mt-1">{errors.password[0]}</p>}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mb-3">Registrar</button>
                        </form>
                        <p className="text-center">¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
