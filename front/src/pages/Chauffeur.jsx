import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const Chauffeur = () => {
    const [chauffeurs, setChauffeurs] = useState([]);
    // const [chauffeur, setChauffeur] = useState();
    const [modal, setModal] = useState(false);

    const getChauffeurs = () => {
        const fetchData = async () => {
            try {
                const data = (await axios.get('/api/chauffeur/getchauffeurs'));
                // console.log(data.data);
                setChauffeurs(data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    };

    useEffect(() => {
        getChauffeurs();
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const elements = form.elements;

        const nom = elements.nom.value;
        const telephone = elements.telephone.value;
        const numpermis = elements.numpermis.value;
        const montant = elements.montant.value;
        // console.log(`nom: ${nom}, telephone: ${telephone}, numpermis: ${numpermis}, montant: ${montant}`);

        const chauffeur = {
            nom,
            telephone,
            numpermis,
            montant
        };
        console.log(chauffeur);
        try {
            const data = (await axios.post('/api/chauffeur/addchauffeur', chauffeur)).data;
            Swal.fire({
                title: "Chauffeur ajouté avec succès!",
                icon: "success",
            }).then(() => {
                window.location.href = '/chauffeur';
            });
        } catch (error) {
            console.error("Erreur lors de l'ajout du chauffeur:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Chauffeur n'a pas été ajouté avec succès!",
            }).then(() => {
                window.location.href = '/chauffeur';
            });
        }
        form.reset();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = (await axios.delete('/api/chauffeur/chauffeur'))
            // setChauffeur(data);
            getChauffeurs();
        } catch (error) {
            console.log(error);
        }
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
            const data = (await axios.delete(`/api/chauffeur/deletechauffeur/${id}`));
            Swal.fire({
                title: "Chauffeur supprimé avec succès!",
                icon: "success",
            });
            getChauffeurs();
        } catch (error) {
            console.error("Erreur lors de la suppression du chauffeur:", error);
        }
    };

    return (
        <div>
            <div className="card mt-3">
                <div className="card-header border-0">
                    <h3 className="card-title"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Listes des chauffeurs</font></font></h3>
                    <div className="card-tools">
                        <button type="button" className="btn btn-info" data-toggle="modal" data-target="#modal-ajoutchauf"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}><i class="nav-icon far fa-plus-square"></i> Ajouter un chauffeur</font></font></button>
                    </div>
                </div>
                <div className="card-body table-responsive p-0">
                    <table className="table table-striped table-valign-middle">
                        <thead>
                            <tr>
                                <th><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Nom</font></font></th>
                                <th><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Téléphone</font></font></th>
                                <th><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Num Permis</font></font></th>
                                <th><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Montant/j</font></font></th>
                                <th><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Actions</font></font></th>
                            </tr>
                        </thead>
                        <tbody>

                            {chauffeurs.map((chauffeur, index) => (
                                <tr key={index}>
                                    <td>
                                        <font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                            {chauffeur.nom}
                                        </font></font>
                                    </td>
                                    <td><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>{chauffeur.telephone}</font></font></td>
                                    <td><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                        {chauffeur.numpermis}
                                    </font></font></td>
                                    <td><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>{chauffeur.montant} fcfa</font></font></td>
                                    <td>
                                        <Link to={`/chauffeurUpdate/${chauffeur._id}`} className="text-muted mr-3" >
                                            <i className="fas fa-edit text-info" />
                                        </Link>

                                        <a href="#" className="text-muted" onClick={() => handleDelete(chauffeur._id)}>
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
                            <h4 className="modal-title">Ajout Chauffeur </h4>
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
                                                    <input type="text" className="form-control" placeholder="nom chauffeur" name='nom' />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Numéro de téléphone</font></font></label>
                                                    <input type="text" className="form-control" placeholder="7........." name='telephone' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                {/* text input */}
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Numéro Permis</font></font></label>
                                                    <input type="text" className="form-control" name='numpermis' />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Montant Journaliére</font></font></label>
                                                    <input type="text" className="form-control" name='montant' />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary"> Save changes</button>
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

export default Chauffeur
