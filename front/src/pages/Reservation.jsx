import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { DatePicker } from 'antd';
import moment from 'moment';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams, useLocation, Navigate, useNavigate } from 'react-router-dom';
const { RangePicker } = DatePicker;


const Reservation = () => {
    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fromDate = queryParams.get('from');
    const toDate = queryParams.get('to');
    const [acquereur, setAcquereur] = useState()
    const [engins, setEngines] = useState([]);
    const [chauffeurs, setChauffeurs] = useState();
    const [montantChauffeur, setmontantChauffeur] = useState(0);
    const [enginDetails, setEnginDetails] = useState(null);
    const [montantenginDetails, setMontantEnginDetails] = useState(null);
    const [totaljour, setTotaljour] = useState(0);
    const [chauffeurNom, setChauffeurNom] = useState('');
    const [montantTotal, setTotalMontant] = useState(0);
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const navigate = useNavigate();
    // Facture
    const printRef = React.useRef(null);
    const handleDownloadPdf = async () => {
        const element = printRef.current;
        if (!element) {
            return;
        }

        const canvas = await html2canvas(element, {
            scale: 2,
        });
        const data = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
        });

        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();

        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("reservation.pdf");
    };
    //--Facture
    const getEngines = async () => {
        try {
            const data = (await axios.get('/api/engin/getengins'));
            setEngines(data.data);
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
                // data.data.forEach(chauffeur => console.log('chauffeur id:', chauffeur._id));
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }
    const getEnginDetails = async () => {
        try {
            const data = (await axios.get(`/api/engin/getengin/${id}`));
            setEnginDetails(data.data);
            setMontantEnginDetails(Number(data.data.montant));
            // console.log(data.data.montant);

        } catch (error) {
            console.error(error);
        }
    };
    const getReservations = async () => {
        try {
            const data = (await axios.get('/api/reservation/getreservations'));
            setReservations(data.data);
            // console.log(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getEngines();
        getchauffeurs();
        getEnginDetails();
        getReservations();

        if (fromDate && toDate) {
            const debutjour = moment(fromDate, 'DD-MM-YYYY');
            const finjour = moment(toDate, 'DD-MM-YYYY');
            const newTotaljour = moment.duration(finjour.diff(debutjour)).asDays() + 1;
            setTotaljour(newTotaljour);
        }

        // if (chauffeurs && enginDetails) {
        //     const chauffeur = chauffeurs.find(chauffeur => chauffeur._id === enginDetails.chauffeurid);
        //     setChauffeurNom(chauffeur ? chauffeur.nom : 'Inconnu');
        //     setmontantChauffeur(chauffeur ? Number(chauffeur.montant) : 0);
        // }

    }, [chauffeurs, enginDetails, montantenginDetails, montantChauffeur]);

    useEffect(() => {
        if (chauffeurs && enginDetails) {
            const chauffeur = chauffeurs.find(chauffeur => chauffeur._id === enginDetails.chauffeurid);
            console.log("Chauffeur correspondant:", chauffeur);
            setChauffeurNom(chauffeur ? chauffeur.nom : 'Inconnu');
            setmontantChauffeur(chauffeur ? Number(chauffeur.montant) : 0);
        }
    }, [chauffeurs, enginDetails]);

    useEffect(() => {
        if (totaljour > 0 && montantenginDetails !== null) {
            setTotalMontant((Number(montantenginDetails) + Number(montantChauffeur || 0)) * Number(totaljour));
        }
    }, [totaljour, montantenginDetails, montantChauffeur]);

    const handleSubmitReservation = async () => {
        try {
            const reservationData = {
                enginid: enginDetails._id,
                enginNom: enginDetails.nom,
                acquereur: acquereur,
                debut: fromDate,
                fin: toDate,
                montantTotal: montantTotal,
                chauffeur: chauffeurNom,
                montantChauffeur: montantChauffeur
            };
            await axios.post('/api/reservation/reservation', reservationData);
            Swal.fire({
                title: "Succès!",
                text: "La réservation a été enregistrée avec succès.",
                icon: "success",
                confirmButtonText: "Fermer"
            }).then(() => {
            });
            navigate('/reservation');
            setAcquereur('');
            setEnginDetails(null);
        } catch (error) {
            Swal.fire({
                title: "Échec!",
                text: "Une erreur est survenue lors de l'enregistrement de la réservation.",
                icon: "error",
                confirmButtonText: "Fermer"
            });
            console.error(error);
        }
    }
    const handleDeleteReservation = async (id) => {
        try {
            const confirmDelete = await Swal.fire({
                title: "Supprimer la réservation?",
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
            const data = (await axios.delete(`/api/reservation/deletereservation/${id}`));
            Swal.fire({
                title: "Réservation supprimée avec succès!",
                icon: "success",
            });
            getReservations();
        } catch (error) {
            console.error("Erreur lors de la suppression de la réservation:", error);
        }
    };

    return (
        <div>
            <div className="card-content">

                {id && (<>
                    <div className="card-header">
                        <h4 className="card-title">Faire une Réservation</h4>
                    </div>
                    <div className="card-body">
                        <div className="card card-primary">
                            <div className="card-body">
                                {enginDetails && (<>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <div className="form-group">
                                                <label>Nom Engin</label>
                                                <h2 className="lead"><b>{enginDetails.nom} </b></h2>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Période</label><br />
                                                <div>
                                                    <p>Date de début: <b>{fromDate}</b></p>
                                                    <p>Date de fin: <b>{toDate}</b></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="form-group">
                                                <label>Nom Acquéreur</label>
                                                <input type="text" required className="form-control" placeholder="nom" onChange={(e) => setAcquereur(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <div className="form-group">
                                                <label>Montant Journaliére</label>
                                                <h2 className="lead"><b>{enginDetails.montant} &nbsp; fcfa</b></h2>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Nom Chauffeur</label>
                                                <h2 className="lead"><b>{chauffeurNom}</b></h2>
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="form-group">
                                                <label>Rénumération chauffeur</label>
                                                <h2 className="lead"><b>{montantChauffeur ? montantChauffeur : 0} &nbsp; fcfa</b></h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Montant Total</label>
                                                <h2 className="lead"><b>{montantTotal}  &nbsp; fcfa</b></h2>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer justify-content-between">
                        <button type="button" className="btn btn-primary" onClick={handleSubmitReservation}>Réserver</button>
                    </div>
                </>)}
                {!id && (<>
                    <div className="card-header">
                        <h4 className="card-title">Liste des Réservations</h4>
                    </div>
                    <div className="card">
                        <div className="card-body p-0">
                            <table className="table table-striped projects">
                                <thead>
                                    <tr>
                                        <th style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                            Nom Engin
                                        </font></font></th>
                                        {/* <th style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                            Chauffeur
                                        </font></font></th>
                                        <th><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                            Acquerreur
                                        </font></font></th> */}
                                        <th style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                            Debut
                                        </font></font></th>
                                        <th style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                            Fin
                                        </font></font></th>
                                        <th style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                            Montant Total
                                        </font></font></th>
                                        <th style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                            Action
                                        </font></font></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations && reservations.map((reservation) => (
                                        <tr key={reservation._id}>
                                            <td>
                                                <font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                                    {reservation.enginNom}
                                                </font></font>
                                            </td>
                                            {/* <td>
                                                <font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                                    {reservation.chauffeur}
                                                </font></font>
                                            </td>
                                            <td><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                                {reservation.acquereur}
                                            </font></font></td> */}
                                            <td><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                                {reservation.debut}
                                            </font></font></td>
                                            <td><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                                {reservation.fin}
                                            </font></font></td>
                                            <td><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>
                                                {reservation.montantTotal} fcfa
                                            </font></font></td>
                                            <td>
                                                <a href='#' onClick={() => handleDeleteReservation(reservation._id)} className="float-right" style={{ marginRight: 1, padding: 3, height: 30 }}>
                                                    <i className="fas fa-trash text-danger" />
                                                </a>
                                                <a href='#' onClick={() => setSelectedReservation(reservation)} data-toggle="modal" data-target="#modal-listreservation" className=" float-right" style={{ marginRight: 4, padding: 3, height: 30 }}>
                                                    <i className="fas fa-eye text-info" />
                                                </a>
                                            </td>
                                        </tr>))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>)}
            </div>

            {/* Modal Reservation */}
            <div className="modal fade" id="modal-listreservation">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Détails de la réservation</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div ref={printRef} className="modal-body">
                            {selectedReservation ? (
                                <div className="card card-primary">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Nom Engin</label>
                                                    <h2 className="lead"><b>{selectedReservation.enginNom}</b></h2>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Nom Acquéreur</label>
                                                    <h2 className="lead"><b>{selectedReservation.acquereur}</b></h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Période</label><br />
                                                    <p>Début: <b>{selectedReservation.debut}</b></p>
                                                    <p>Fin: <b>{selectedReservation.fin}</b></p>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Chauffeur</label>
                                                    <h2 className="lead"><b>{selectedReservation.chauffeur}</b></h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Montant Total</label>
                                                    <h2 className="lead"><b>{selectedReservation.montantTotal} fcfa</b></h2>
                                                </div>
                                            </div>
                                            {/* <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Numéro Chauffeur</label>
                                                    <h2 className="lead"><b>{selectedReservation.montantJour} fcfa</b></h2>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>Chargement...</p>
                            )}
                        </div>
                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
                            <button onClick={handleDownloadPdf} type="button" className="btn btn-primary">Télécharger</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Reservation
