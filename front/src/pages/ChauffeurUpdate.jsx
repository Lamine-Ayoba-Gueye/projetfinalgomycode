import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


const ChauffeurUpdate = () => {
    const { id } = useParams();
    const [values, setValues] = useState({
        nom: '',
        telephone: '',
        numpermis: '',
        montant: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/chauffeur/getchauffeur/${id}`);
                setValues({
                    nom: response.data.nom,
                    telephone: response.data.telephone,
                    numpermis: response.data.numpermis,
                    montant: response.data.montant
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
        await axios.post(`/api/chauffeur/updatechauffeur/${id}`, values);
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/chauffeur/getchauffeur/${id}`);
                setValues({
                    nom: response.data.nom,
                    telephone: response.data.telephone,
                    numpermis: response.data.numpermis,
                    montant: response.data.montant
                });
                Swal.fire({
                    title: "Chauffeur modifié avec succès!",
                    icon: "success",
                }).then(() => {
                    navigate('/chauffeur');
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
                                        <input type="text" className="form-control" value={values.nom} onChange={e => setValues({ ...values, nom: e.target.value })} name='nom' />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Numéro de téléphone</font></font></label>
                                        <input type="text" className="form-control" value={values.telephone} onChange={e => setValues({ ...values, telephone: e.target.value })} name='telephone' />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Numéro Permis</font></font></label>
                                        <input type="text" className="form-control" value={values.numpermis} onChange={e => setValues({ ...values, numpermis: e.target.value })} name='numpermis' />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Montant Journaliére</font></font></label>
                                        <input type="text" className="form-control" value={values.montant} onChange={e => setValues({ ...values, montant: e.target.value })} name='montant' />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-info" data-toggle="modal" data-target="#modal-ajoutchauf">
                                <font style={{ verticalAlign: 'inherit' }}>
                                    <font style={{ verticalAlign: 'inherit' }}>
                                        Modifier chauffeur
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

export default ChauffeurUpdate
