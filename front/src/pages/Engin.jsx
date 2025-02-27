import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { DatePicker } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const { RangePicker } = DatePicker;

const Engin = () => {
    const [engins, setEngines] = useState([]);
    const [file, setFile] = useState('');
    const [nom, setNom] = useState();
    const [numero, setNumero] = useState();
    const [plaque, setPlaque] = useState();
    const [montant, setMontant] = useState();
    const [chauffeurid, setChauffeurid] = useState();
    const [chauffeurs, setChauffeurs] = useState();
    const [fromdate, setFromdate] = useState()
    const [todate, setTodate] = useState()
    const [selectedEnginId, setSelectedEnginId] = useState(null);
    const [selectedEngin, setSelectedEngin] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [duplicateEngin, setDuplicateEngin] = useState([]);

    const navigate = useNavigate();

    const getEngines = async () => {
        try {
            const data = (await axios.get('/api/engin/getengins'));
            setEngines(data.data);
            setDuplicateEngin(data.data);
            // console.log(data.data);
        } catch (error) {
            console.error(error);
        }
    };
    const getchauffeurs = async () => {
        const fetchData = async () => {
            try {
                const data = (await axios.get('/api/chauffeur/getchauffeurs'));
                setChauffeurs(data.data);
                // console.log(data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }

    useEffect(() => {
        getEngines();
        getchauffeurs();
    }, []);

    const handleSubmitEngin = async () => {
        try {
            const formData = new FormData();
            formData.append('nom', nom);
            formData.append('numero', numero);
            formData.append('plaque', plaque);
            formData.append('montant', montant);
            formData.append('chauffeurid', chauffeurid);
            formData.append('img', file);
            await axios.post('/api/engin/engin', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important pour l'envoi de fichiers
                },
            });
            setNom('');
            setNumero('');
            setPlaque('');
            setMontant('');
            setChauffeurid('1');
            setFile(null);
            getEngines();
            Swal.fire({
                title: "Succès!",
                text: "L'engin a été ajouté avec succès.",
                icon: "success",
                confirmButtonText: "Fermer"
            }).then(() => {
                window.location.reload();
            });
        } catch (error) {
            Swal.fire({
                title: "Échec!",
                text: "Une erreur est survenue lors de l'ajout de l'engin. La page sera actualisée.",
                icon: "error",
                confirmButtonText: "Fermer"
            }).then(() => {
                window.location.reload();
            });
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!selectedEnginId) return;
        try {
            await axios.delete(`/api/engin/deleteEngin/${selectedEnginId}`);
            Swal.fire({
                title: "Succès!",
                text: "L'engin a été supprimé avec succès.",
                icon: "success",
                confirmButtonText: "Fermer",
            }).then(() => {
                getEngines();
                window.location.href = '/';
            });
        } catch (error) {
            Swal.fire({
                title: "Erreur!",
                text: error.response?.data?.message || "Une erreur est survenue lors de la suppression de l'engin.",
                icon: "error",
                confirmButtonText: "Fermer",
            });
            console.error(error);
        }
    };

    const handleSubmitEdit = async () => {
        if (!selectedEnginId) return;
        try {
            const formData = new FormData();
            formData.append('nom', nom);
            formData.append('numero', numero);
            formData.append('plaque', plaque);
            formData.append('montant', montant);
            formData.append('chauffeurid', chauffeurid);
            if (file) {
                formData.append('img', file);
            }

            const response = await axios.put(`/api/engin/updateEngin/${selectedEnginId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                title: "Succès!",
                text: "L'engin a été modifié avec succès.",
                icon: "success",
                confirmButtonText: "Fermer",
            }).then(() => {
                getEngines();
                window.location.href = '/';
            });

        } catch (error) {
            Swal.fire({
                title: "Erreur!",
                text: error.response?.data?.message || "Une erreur est survenue lors de la modification de l'engin.",
                icon: "error",
                confirmButtonText: "Fermer",
            });
            console.error(error);
        }
    };

    function selectdate(dates) {
        const formattedFromDate = dates[0].format('DD-MM-YYYY');
        const formattedToDate = dates[1].format('DD-MM-YYYY');
        setFromdate(formattedFromDate);
        setTodate(formattedToDate);
        // console.log(formattedFromDate, formattedToDate);
        filterBydate(dates);
    }

    function filterBydate(dates) {
        if (!dates || dates.length < 2) return;

        const formattedFromDate = dates[0].format('DD-MM-YYYY');
        const formattedToDate = dates[1].format('DD-MM-YYYY');

        setFromdate(formattedFromDate);
        setTodate(formattedToDate);

        const tempEngins = duplicateEngin.filter(engin => {
            if (!engin.reservationEnCours || engin.reservationEnCours.length === 0) {
                return true;
            }

            const estDisponible = !engin.reservationEnCours.some(reserv => {
                const debutReserv = moment(reserv.debut, 'DD-MM-YYYY');
                const finReserv = moment(reserv.fin, 'DD-MM-YYYY');
                const fromDateMoment = moment(formattedFromDate, 'DD-MM-YYYY');
                const toDateMoment = moment(formattedToDate, 'DD-MM-YYYY');

                return (
                    fromDateMoment.isBetween(debutReserv, finReserv, undefined, '[]') ||
                    toDateMoment.isBetween(debutReserv, finReserv, undefined, '[]') ||
                    debutReserv.isBetween(fromDateMoment, toDateMoment, undefined, '[]') ||
                    finReserv.isBetween(fromDateMoment, toDateMoment, undefined, '[]') ||
                    formattedFromDate === reserv.debut ||
                    formattedFromDate === reserv.fin ||
                    formattedToDate === reserv.debut ||
                    formattedToDate === reserv.fin
                );
            });

            return estDisponible;
        });
        setEngines(tempEngins);
    }

    const handleReservationClick = (engin) => {
        setSelectedEngin(engin);
        navigate('/reservation');
    }

    return (
        <div className='card mt-3'>
            <div className="card-header border-0">
                <h3 className="card-title"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Listes des Engins</font></font></h3>
                <div className="card-tools">
                    <button type="button" className="btn btn-info" data-toggle="modal" data-target="#modal-ajoutengin"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}><i class="nav-icon far fa-plus-square"></i> Ajouter un Engin</font></font></button>
                </div>
            </div>
            <div className='col-6'><RangePicker format="DD-MM-YYYY" onChange={filterBydate} /></div>
            <div className="card-body">
                <div className='row '>
                    {engins && engins.map((engin) => (
                        <div className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column" key={engin._id}>
                            <div className="card bg-light d-flex flex-fill">
                                <div className="card-body pt-0">
                                    <div className="row mt-3">
                                        <div className="col-7">
                                            <h2 className="lead"><b><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Nom Engin</font></font></b> <font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>{engin.nom}</font></font></h2>
                                            <p className="text-muted text-sm"><b><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Numéro Engin: &nbsp;</font></font></b><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>{engin.numero}</font></font></p>
                                            <p className="text-muted text-sm"><b><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Numéro Plaque:</font></font></b><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}> {engin.plaque}</font></font></p>
                                            <p className="text-muted text-sm"><b><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Montant / &nbsp;j &nbsp;: &nbsp;</font></font></b><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}> &nbsp; {engin.montant} &nbsp; fcfa</font></font></p>
                                            {chauffeurs && engin.chauffeurid && (
                                                <>
                                                    <p className="text-muted text-sm">
                                                        <b><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Nom Chauffeur:</font></font></b>
                                                        <font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>{chauffeurs.find(chauffeur => chauffeur._id === engin.chauffeurid)?.nom || 'Inconnu'}</font></font>
                                                    </p>
                                                </>
                                            )}

                                        </div>
                                        <div className="col-5 text-center">
                                            <img src={`http://localhost:4000/public/images/${engin.img}`} alt="utilisateur-avatar" className="img-circle img-fluid" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <button
                                            type="button"
                                            className="btn btn-sm ml-2 btn-danger"
                                            data-toggle="modal"
                                            data-target="#modal-delete"
                                            onClick={() => setSelectedEnginId(engin._id)} // Stocker l'ID de l'engin
                                        >
                                            <i className="far fa-trash-alt mr-1"></i> Supprimer
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm ml-2 btn-info mr-1"
                                            data-toggle="modal"
                                            data-target="#modal-update"
                                            onClick={() => setSelectedEnginId(engin._id)} // Stocker l'ID de l'engin
                                        ><i className="nav-icon fas fa-edit mr-1"></i> Modifier
                                        </button>
                                        {(fromdate && todate) && (<>
                                            <Link to={`/reservation/${engin._id}?from=${fromdate}&to=${todate}`} className="btn btn-sm btn-success mt-2">
                                                <i class="fas fa-check"></i><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Réserver</font></font>
                                            </Link>
                                        </>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* Modal Ajout Engin */}
            <div className="modal fade" id="modal-ajoutengin">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Ajout Engin</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmitEngin(); }}>
                            <div className="modal-body">
                                <div className="card card-primary">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Nom Engin</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Nom engin"
                                                        value={nom} // Contrôle la valeur du champ
                                                        onChange={(e) => setNom(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Numéro Engin</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="7........."
                                                        value={numero} // Contrôle la valeur du champ
                                                        onChange={(e) => setNumero(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Numéro Plaque</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        className="form-control"
                                                        value={plaque} // Contrôle la valeur du champ
                                                        onChange={(e) => setPlaque(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Montant Journalier</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        className="form-control"
                                                        value={montant} // Contrôle la valeur du champ
                                                        onChange={(e) => setMontant(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Nom Chauffeur</label>
                                                    <select
                                                        required
                                                        className="form-control"
                                                        value={chauffeurid} // Contrôle la valeur du champ
                                                        onChange={(e) => setChauffeurid(e.target.value)}
                                                    >
                                                        <option value="" disabled>Sélectionnez un chauffeur</option>
                                                        {chauffeurs && chauffeurs.map((chauf) => (
                                                            <option key={chauf._id} value={chauf._id}>
                                                                {chauf.nom}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Image</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        onChange={(e) => setFile(e.target.files[0])}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
                                <button type="submit" className="btn btn-primary">Ajouter</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Modal Update Engin */}
            <div className="modal fade" id="modal-update" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modifier l'engin</h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal" aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmitEdit(); }}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Nom Engin</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nom}
                                        onChange={(e) => setNom(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Numéro Engin</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={numero}
                                        onChange={(e) => setNumero(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Numéro Plaque</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={plaque}
                                        onChange={(e) => setPlaque(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Montant Journalier</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={montant}
                                        onChange={(e) => setMontant(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Chauffeur</label>
                                    <select
                                        className="form-control"
                                        value={chauffeurid}
                                        onChange={(e) => setChauffeurid(e.target.value)}
                                    >
                                        <option value="">Sélectionnez un chauffeur</option>
                                        {chauffeurs && chauffeurs.map((chauffeur) => (
                                            <option key={chauffeur._id} value={chauffeur._id}>
                                                {chauffeur.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
                                <button type="submit" className="btn btn-primary">Modifier</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal Delete Engin */}
            <div className="modal fade" id="modal-delete" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Supprimer l'engin</h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal" aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Êtes-vous sûr de vouloir supprimer cet engin ?</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal" aria-label="Close"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Engin
