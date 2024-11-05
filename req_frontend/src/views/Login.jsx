import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/contextprovider';
import { FaEnvelope, FaLock, FaUserPlus, FaShieldAlt, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let errors = {};

        if (!email) {
            errors.email = "El campo de correo electrónico es obligatorio.";
        }

        if (!password) {
            errors.password = "El campo de contraseña es obligatorio.";
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const payload = { email, password };
        setIsLoading(true);

        axiosClient.post("/login", payload)
            .then(({ data }) => {
                if (data.user && data.token) {
                    setUser(data.user);
                    setToken(data.token);
                } else {
                    setErrors({ message: "El correo electrónico o la contraseña no coinciden." });
                }
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
                console.log(response.data.errors);
            }).finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="container d-flex align-items-center min-vh-100">
            <div className="row justify-content-center w-100">
                <div className="col-12 col-md-5 col-lg-5 col-xl-5">
                    <div className="card shadow p-4 hover-effect">
                        <h2 className="text-center mb-4">Iniciar Sesión</h2>
                        <div className="text-center mb-4">
                            <h5>Bienvenido al Sistema de Requisiciones ITSJ</h5>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4 form-group form-floating">
                                <input
                                    type="email"
                                    className={`form-control ${errors?.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    placeholder="ejemplo@gmail.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                <label htmlFor="email">
                                    <FaEnvelope className="me-2" />
                                    Correo Electrónico
                                </label>
                                {errors?.email && (
                                    <div className="invalid-feedback">{errors.email}</div>
                                )}
                                <small className="form-text text-muted">Ejemplo: ejemplo@gmail.com</small>
                            </div>
                            <div className="mb-4 form-group form-floating">
                                <input
                                    type="password"
                                    className={`form-control ${errors?.password ? 'is-invalid' : ''}`}
                                    id="password"
                                    placeholder="Mínimo 8 caracteres"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <label htmlFor="password">
                                    <FaLock className="me-2" />
                                    Contraseña
                                </label>
                                {errors?.password && (
                                    <div className="invalid-feedback">{errors.password}</div>
                                )}
                                {errors?.message && (
                                    <div className="invalid-feedback">{errors.message}</div>
                                )}
                                <small className="form-text text-muted">Mínimo 8 caracteres</small>
                            </div>
                            
                            <button type="submit" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center hover-effect" disabled={isLoading}>
                                {isLoading ?
                                    (<span className="spinner-border spinner-border-sm mt-1" role="status" aria-hidden="true"></span>)
                                    :
                                    (<><FaSignInAlt className="me-2" /><span>Iniciar Sesión</span></>)
                                }
                            </button>
                        </form>
                        <p className="text-center mt-4">
                            ¿No tienes cuenta? <Link to="/register" className="text-decoration-none hover-effect">
                                 Regístrate aquí <FaUserPlus className="ms-1" />
                            </Link>
                        </p>
                        <div className="d-flex align-items-center justify-content-center mb-4">
                                <FaShieldAlt className="me-2 text-primary" />
                                <small className="text-muted">Tu inicio de sesión es seguro</small>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
