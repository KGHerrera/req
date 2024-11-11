import React, { useEffect, useState } from 'react';
import axiosClient from '../axiosClient';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const UserTable = ({ onEdit }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [search, page]);

    const fetchUsers = () => {
        axiosClient.get(`/users?search=${search}&page=${page}`)
            .then(response => {
                setUsers(response.data.data);
                setTotalPages(response.data.last_page);
            })
            .catch(error => {
                console.error('Hubo un error al obtener los usuarios:', error);
            });
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleDelete = (userId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.delete(`/users/${userId}`)
                    .then(() => {
                        Swal.fire(
                            'Eliminado',
                            'El usuario ha sido eliminado',
                            'success'
                        );
                        fetchUsers();
                    })
                    .catch(error => {
                        console.error('Error al eliminar usuario:', error);
                    });
            }
        });
    };

    const handleEdit = (user) => {
        onEdit(user);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Desplaza la página hacia arriba de manera suave
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Usuarios</h2>
            <div className="col-12 col-md-12 mb-4 form-group form-floating">
                <input
                    type="text"
                    className={`form-control`}
                    id="search"
                    name="search"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Buscar..."
                    required
                />
                <label htmlFor="search" className='ms-2'>
                    <FaSearch className="me-2" />
                    Buscar
                </label>
                
                <small className="form-text text-muted">Ingrese el termino de búsqueda</small>
            </div>
            <table className="table table-bordered table-hover small">
                <thead className='table-light'>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Clave Departamento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.rol}</td>
                            <td>{user.clave_departamento}</td>
                            <td className="d-flex justify-content-center align-items-center gap-2">
                                <button
                                    className="btn btn-primary btn-sm d-flex align-items-center"
                                    onClick={() => handleEdit(user)}
                                >
                                    <FaEdit className="m-1" />
                                </button>
                                <button
                                    className="btn btn-danger btn-sm d-flex align-items-center"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    <FaTrash className="m-1" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    <FaArrowLeft className="me-1" /> 
                </button>
                <span>Página {page} de {totalPages}</span>
                <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                     <FaArrowRight className="ms-1" />
                </button>
            </div>
        </div>
    );
};

export default UserTable;
