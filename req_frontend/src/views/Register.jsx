import React, { useState, useRef } from 'react';
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/contextprovider';

const Register = () => {
    const { setUser, setToken } = useStateContext();
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const rolRef = useRef(null);
    const claveDepartamentoRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        

        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            rol: rolRef.current.value,
            clave_departamento: claveDepartamentoRef.current.value,
            password: passwordRef.current.value,
        };

        console.log(payload);

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
                console.log('response: ', response);
            }
            setErrors(response.data.errors);
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
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="name" className="form-label">Nombre</label>
                                    <input ref={nameRef} type="text" className="form-control" id="name" placeholder="Introduce tu nombre" />
                                    {errors.name && <p className="text-danger small mb-0">{errors.name[0]}</p>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                    <input ref={emailRef} type="email" className="form-control" id="email" placeholder="Introduce tu correo electrónico" />
                                    {errors.email && <p className="text-danger small mb-0">{errors.email[0]}</p>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="rol" className="form-label">Rol</label>
                                    <input ref={rolRef} type="text" className="form-control" id="rol" placeholder="Introduce tu rol" />
                                    {errors.rol && <p className="text-danger small mb-0">{errors.rol[0]}</p>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="claveDepartamento" className="form-label">Clave Departamento</label>
                                    <input ref={claveDepartamentoRef} type="text" className="form-control" id="claveDepartamento" placeholder="Introduce tu clave de departamento" />
                                    {errors.clave_departamento && <p className="text-danger small mb-0">{errors.clave_departamento[0]}</p>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input ref={passwordRef} type="password" className="form-control" id="password" placeholder="Introduce tu contraseña" />
                                    {errors.password && <p className="text-danger small mb-0">{errors.password[0]}</p>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                                    <input ref={confirmPasswordRef} type="password" className="form-control" id="confirmPassword" placeholder="Confirma tu contraseña" />
                                    {errors.password && <p className="text-danger small mb-0">{errors.password[0]}</p>}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Registrar</button>
                        </form>
                        <p className="text-center mt-3">¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
