import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div>
            {/* Main Sidebar Container */}
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* Brand Logo */}
                <a href="index3.html" className="brand-link">
                    <img src="./logocater.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light">Réservation Engin</span>
                </a>
                {/* Sidebar */}
                <div className="sidebar">
                    {/* Sidebar user panel (optional) */}
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            {/* <img src="./LogoCCIAK.png" className="img-circle elevation-2" alt="User Image" /> */}
                        </div>
                        <div className="info">
                            <a href="#" className="d-block">Tableau de bord</a>
                        </div>
                    </div>
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                            <li className="nav-item menu-open">

                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <a href="/" className="nav-link active">
                                            <i className="nav-icon fas fa-tachometer-alt" />
                                            <p>Engin</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/chauffeur" className="nav-link active">
                                            <i className="nav-icon fas fa-copy" />
                                            <p>Chauffeur</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/reservation" className="nav-link active">
                                            <i className="nav-icon fas fa-copy" />
                                            <p>Réservation</p>
                                        </a>
                                    </li>
                                    {/* <li className="nav-item">
                                        <a href="/user" className="nav-link active">
                                            <i className="nav-icon fas fa-user-circle" />
                                            <p>Utilisateur</p>
                                        </a>
                                    </li> */}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                    {/* /.sidebar-menu */}
                </div>
                {/* /.sidebar */}
            </aside>

        </div>
    )
}

export default Sidebar
