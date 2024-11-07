import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/contextprovider';
import { FaUser, FaEnvelope, FaKey, FaBuilding, FaUserPlus, FaShieldAlt, FaSignInAlt } from 'react-icons/fa';

const Register = () => {
    const { setUser, setToken } = useStateContext();
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const claveDepartamentoRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        setConfirmPasswordError(''); // Reset confirm password error

        const payload = {
            name: nameRef.current.value.toLowerCase(),
            email: emailRef.current.value.toLowerCase(),
            rol: "user",
            clave_departamento: claveDepartamentoRef.current.value.toUpperCase(),
            password: passwordRef.current.value.toLowerCase(),
        };
        

        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            setConfirmPasswordError("Las contraseñas no coinciden");
            setIsLoading(false);
            return;
        }

        axiosClient.post("/register", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }

                else {
                    setErrors({ message: "No se pudo conectar con el servidor, por favor más tarde." });
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="container d-flex align-items-center min-vh-100">
            <div className="row justify-content-center w-100">
                <div className="col-12 col-md-8 col-lg-8 col-xl-8">
                    <div className="card shadow p-4 hover-effect">
                        <h2 className="text-center mb-4">Registro</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-12 col-md-6 mb-4 form-group form-floating">
                                    <input
                                        ref={nameRef}
                                        type="text"
                                        className={`form-control ${errors?.name ? 'is-invalid' : ''}`}
                                        id="name"
                                        placeholder="Introduce tu nombre"
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
                                        placeholder="Introduce tu correo electrónico"
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
                                    <input
                                        ref={claveDepartamentoRef}
                                        type="text"
                                        className={`form-control ${errors?.clave_departamento ? 'is-invalid' : ''}`}
                                        id="claveDepartamento"
                                        placeholder="Introduce tu clave de departamento"
                                    />
                                    <label htmlFor="claveDepartamento" className='ms-2'>
                                        <FaBuilding className="me-2" />
                                        Clave Departamento
                                    </label>
                                    {errors?.clave_departamento && (
                                        <div className="invalid-feedback">{errors.clave_departamento[0]}</div>
                                    )}
                                    <small className="form-text text-muted">Abrebiado en tres letras mayúsculas.</small>
                                </div>
                                <div className="col-12 col-md-6 mb-4 form-group form-floating">
                                    <input
                                        ref={passwordRef}
                                        type="password"
                                        className={`form-control ${errors?.password ? 'is-invalid' : ''}`}
                                        id="password"
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
                                <div className="col-12 mb-4 form-group form-floating">
                                    <input
                                        ref={confirmPasswordRef}
                                        type="password"
                                        className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
                                        id="confirmPassword"
                                        placeholder="Confirma tu contraseña"
                                    />
                                    <label htmlFor="confirmPassword" className='ms-2'>
                                        <FaKey className="me-2" />
                                        Confirmar Contraseña
                                    </label>
                                    {confirmPasswordError && (
                                        <div className="invalid-feedback">{confirmPasswordError}</div>
                                    )}
                                    <small className="form-text text-muted">Mínimo 8 caracteres, iguales a la anterior</small>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center hover-effect" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="spinner-border spinner-border-sm mt-1" role="status" aria-hidden="true"></span>
                                ) : (
                                    <>
                                        <FaUserPlus className="me-2" /><span>Registrar</span>
                                    </>
                                )}
                            </button>

                            {errors.message &&
                                <div className="text-center small mt-2 text-danger">
                                    {errors.message}
                                </div>
                            }
                        </form>
                        <p className="text-center mt-4">
                            ¿Ya tienes una cuenta? <Link to="/login" className="text-decoration-none hover-effect">
                                Inicia sesión aquí <FaSignInAlt className="ms-2" />
                            </Link>
                        </p>
                        <div className="d-flex align-items-center justify-content-center mb-4">
                            <FaShieldAlt className="me-2 text-primary" />
                            <small className="text-muted">Tu registro es seguro</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
