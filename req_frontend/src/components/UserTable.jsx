import React, { useEffect, useState } from 'react';
import axiosClient from '../axiosClient';
import Swal from 'sweetalert2';

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

    return (
        <div className="container mt-4">
            <h2>Lista de Usuarios</h2>
            <input
                type="text"
                placeholder="Buscar..."
                className="form-control mb-3"
                value={search}
                onChange={handleSearchChange}
            />
            <table className="table table-striped">
                <thead>
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
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => onEdit(user)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-primary"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    Anterior
                </button>
                <span>Página {page} de {totalPages}</span>
                <button
                    className="btn btn-primary"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default UserTable;
