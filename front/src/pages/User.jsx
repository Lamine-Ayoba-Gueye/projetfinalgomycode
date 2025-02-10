import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';
import Swal from 'sweetalert2';

const User = () => {
    const [users, setUser] = useState([]);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isAdmin, setisAdmin] = useState();

    const getUsers = async () => {
        try {
            const data = (await axios.get('/api/user/getusers'));
            setUser(data.data);
            // console.log(data.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const elements = form.elements;

        const name = elements.name.value;
        const email = elements.email.value;
        const password = elements.password.value;
        const isAdmin = elements.isAdmin.value;

        const user = {
            name,
            email,
            password,
            isAdmin
        };
        console.log(user);
        try {
            const data = (await axios.post('/api/user/register', user)).data;
            Swal.fire({
                title: "Chauffeur ajouté avec succès!",
                icon: "success",
            }).then(() => {
                window.location.href = '/user';
            });
        } catch (error) {
            console.error("Erreur lors de l'ajout du chauffeur:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Chauffeur n'a pas été ajouté avec succès!",
            }).then(() => {
                window.location.href = '/user';
            });
        }
        form.reset();
    };

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await Swal.fire({
                title: "Supprimer le chauffeur?",
                text: "Vous ne pourrez pas récupérer cette action!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui, supprimer!",
                cancelButtonText: "Non, annuler",
                reverseButtons: true
            });

            if (!confirmDelete.value) {
                return;
            }
            const data = (await axios.delete(`/api/user/deleteuser/${id}`));
            Swal.fire({
                title: "Chauffeur supprimé avec succès!",
                icon: "success",
            });
            getUsers();
        } catch (error) {
            console.error("Erreur lors de la suppression du chauffeur:", error);
        }
    };
    return (
        // <div> </div>
        <div>
            <div className="card mt-3">
                <div className="card-header border-0">
                    <h3 className="card-title"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Listes des Utilisateurs</font></font></h3>
                    <div className="card-tools">
                        <button type="button" className="btn btn-info" data-toggle="modal" data-target="#modal-ajoutchauf"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>+ Ajouter un utilisateur</font></font></button>
                    </div>
                </div>
                <div className="card-body table-responsive p-0">
                    <table className="table table-striped table-valign-middle">
                        <thead>
                            <tr>
                                <th><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Namae</font></font></th>
                                <th><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Email</font></font></th>
                                <th><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Admin</font></font></th>
                                <th><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Actions</font></font></th>
                            </tr>
                        </thead>
                        <tbody>

                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>
                                        <font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                            {user.name}
                                        </font></font>
                                    </td>
                                    <td><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>{user.email}</font></font></td>
                                    <td><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                        {user.isAdmin}
                                    </font></font></td>
                                    <td>
                                        <Link to={`/userUpdate/${user._id}`} className="text-muted mr-3" >
                                            <i className="fas fa-edit text-info" />
                                        </Link>

                                        <a href="#" className="text-muted" onClick={() => handleDelete(user._id)}>
                                            <i className="fas fa-trash text-danger" />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="modal fade" id="modal-ajoutchauf">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Ajout Utilisateur </h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="card card-primary">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                {/* text input */}
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Prénom & Nom</font></font></label>
                                                    <input required type="text" className="form-control" placeholder="nom utilisateur" name='name' />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Email</font></font></label>
                                                    <input required type="text" className="form-control" placeholder=".....@gmail.com" name='email' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                {/* text input */}
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Admin</font></font></label>
                                                    <select className="form-control" name='isAdmin'>
                                                        <option disabled>Séléctionner</option>
                                                        <option value="false">Faux</option>
                                                        <option value="true">Vrai</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Password</font></font></label>
                                                    <input required type="text" className="form-control" name='password' />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
                                <button type="submit" className="btn btn-primary"> Enregistrer</button>
                            </div>
                        </form>
                    </div>
                    {/* /.modal-content */}
                </div>
                {/* /.modal-dialog */}
            </div>
        </div>
    )
}

export default User
