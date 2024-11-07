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
            <div className="input-group mb-3">
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="form-control"
                    value={search}
                    onChange={handleSearchChange}
                />
                <span className="input-group-text"><FaSearch /></span>
            </div>
            <table className="table table-bordered table-hover">
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
                                    <FaEdit className="me-1" /> Editar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm d-flex align-items-center"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    <FaTrash className="me-1" /> Eliminar
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
                    <FaArrowLeft className="me-1" /> Anterior
                </button>
                <span>Página {page} de {totalPages}</span>
                <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    Siguiente <FaArrowRight className="ms-1" />
                </button>
            </div>
        </div>
    );
};

export default UserTable;
