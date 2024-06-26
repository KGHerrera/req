import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/contextprovider';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        let errors = {};

        // Verificar si el campo de correo electrónico está vacío
        if (!email) {
            errors.email = "El campo de correo electrónico es obligatorio.";
        }

        // Verificar si el campo de contraseña está vacío
        if (!password) {
            errors.password = "El campo de contraseña es obligatorio.";
        }

        // Si hay errores, establecerlos y detener la ejecución de la función
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const payload = {
            email: email,
            password: password
        };

        axiosClient.post("/login", payload)
            .then(({ data }) => {
                if (data.user && data.token) {
                    
                    setUser(data.user);
                    setToken(data.token);
                    
                } else {
                    // Credenciales incorrectas, mostrar mensaje de error (simulado)
                    setErrors({ message: "El correo electrónico o la contraseña no coinciden." });
                }
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
                console.log(response.data.errors);
            });
    };

    return (
        <div className="container d-flex align-items-center min-vh-100">
            <div className="row justify-content-center w-100">
                <div className="col-12 col-md-7 col-lg-5 col-xl-4">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">Iniciar Sesión</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Introduce tu correo electrónico"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                {errors && errors.email && (
                                    <p className="text-danger small mb-0">{errors.email}</p>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Introduce tu contraseña"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                {errors && errors.password && (
                                    <p className="text-danger small mb-0">{errors.password}</p>
                                )}
                                {errors && errors.message && (
                                    <p className="text-danger small mb-0">{errors.message}</p>
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                        </form>
                        <p className="text-center mt-3">Para registrarse, <Link to="/register">haga clic aquí</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
