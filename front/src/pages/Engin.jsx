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
    const [acquereur, setAcqureur] = useState()
    const [selectedEngin, setSelectedEngin] = useState(null);
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
            await axios.post('/api/engin/engin', formData);
            getEngines();
            setNom('');
            setNumero('');
            setPlaque('');
            setMontant('');
            setChauffeurid('1');
            setFile(null);
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
                                        {/* <div className="col-5 text-center">
                                            <img src={`http://localhost:4000/public/images/${engin.img}`} alt="utilisateur-avatar" className="img-circle img-fluid" />
                                        </div> */}
                                    </div>
                                    <div className="text-right">
                                        {(fromdate && todate) && (<>
                                            <Link to={`/reservation/${engin._id}?from=${fromdate}&to=${todate}`} className="btn btn-sm btn-success">
                                                <i className="nav-icon fas fa-edit"></i><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Réserver</font></font>
                                            </Link>
                                        </>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <div className="modal fade" id="modal-ajoutengin">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Ajout Engin</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <form>
                            <div className="modal-body">
                                <div className="card card-primary">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Nom Engin</font></font></label>
                                                    <input required type="text" className="form-control" placeholder="nom engin" onChange={(e) => setNom(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Numéro Engin</font></font></label>
                                                    <input required type="number" className="form-control" placeholder="7........." onChange={(e) => setNumero(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Numéro Plaque</font></font></label>
                                                    <input required type="text" className="form-control" onChange={(e) => setPlaque(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Montant Journaliére</font></font></label>
                                                    <input required type="number" className="form-control" onChange={(e) => setMontant(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Nom Chauffeur</font></font></label>
                                                    <select required className="form-control" onChange={(e) => setChauffeurid(e.target.value)}>
                                                        <option value="" disabled>Sélectionnez un chauffeur</option>
                                                        {chauffeurs && chauffeurs.map((chauf) => (
                                                            <option key={chauf.id} value={chauf._id}>{chauf.nom}</option>

                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            {/* <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Image</font></font></label>
                                                    <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
                                                </div>
                                            </div> */}
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmitEngin}>Ajouter</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal Reservation    tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"    */}
            <div className="modal fade" id="modal-reservation">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Réservation</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <form>
                            <div className="modal-body">
                                <div className="card card-primary">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Période</label><br />
                                                    <RangePicker format="DD-MM-YYYY" onChange={selectdate} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Nom Acquéreur</label>
                                                    <input type="text" className="form-control" placeholder="nom" onChange={(e) => setAcqureur(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Montant Journaliére</label>
                                                    <h2 className="lead"><b>{selectedEngin?.montant} &nbsp; fcfa</b></h2>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Montant Total</label>
                                                    <h2 className="lead"><b>{selectedEngin?.montant}</b></h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" >Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Engin
