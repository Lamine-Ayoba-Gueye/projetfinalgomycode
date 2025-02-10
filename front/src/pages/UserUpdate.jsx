import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


const UserUpdate = () => {
    const { id } = useParams();
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        isAdmin: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/chauffeur/getusers/${id}`);
                setValues({
                    name: response.data.name,
                    email: response.data.email,
                    password: response.data.password,
                    isAdmin: response.data.isAdmin
                });
            } catch (error) {
                console.error(error);
            }
        };
        if (id) {
            fetchData();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`/api/user/updateuser/${id}`, values);
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/user/getusers/${id}`);
                setValues({
                    name: response.data.name,
                    email: response.data.email,
                    password: response.data.password,
                    isAdmin: response.data.isAdmin
                });
                Swal.fire({
                    title: "Chauffeur modifié avec succès!",
                    icon: "success",
                }).then(() => {
                    navigate('/user');
                });
            } catch (error) {
                Swal.fire({
                    title: "Erreur lors de la modification du chauffeur",
                    text: error.message,
                    icon: "error",
                });
            }
        };
        fetchData();
    };

    return (
        <div className="d-flex justify-content-center">
            <div>
                <div className="card mt-3">
                    <div className="card-header border-0">
                        <h3 className="card-title"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Modifier {values.nom}</font></font></h3>

                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Prénom & Nom</font></font></label>
                                        <input type="text" className="form-control" value={values.name} onChange={e => setValues({ ...values, name: e.target.value })} name='name' />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Email</font></font></label>
                                        <input type="text" className="form-control" value={values.email} onChange={e => setValues({ ...values, email: e.target.value })} name='email' />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Mot de Passe</font></font></label>
                                        <input type="text" className="form-control" value={values.password} onChange={e => setValues({ ...values, password: e.target.value })} name='password' />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Admin</font></font></label>
                                        <option disabled>Séléctionner</option>
                                        <select className="form-control" value={values.admin} onChange={e => setValues({ ...values, admin: e.target.value })} name='admin'>
                                            <option value="true">Vrai</option>
                                            <option value="false">Faux</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-info" data-toggle="modal" data-target="#modal-ajoutchauf">
                                <font style={{ verticalAlign: 'inherit' }}>
                                    <font style={{ verticalAlign: 'inherit' }}>
                                        Modifier Utilisateur
                                    </font>
                                </font>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserUpdate
