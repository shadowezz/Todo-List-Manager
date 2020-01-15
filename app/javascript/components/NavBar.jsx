import React from 'react'
import {Link} from "react-router-dom"

class NavBar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <nav className="navbar sticky-top navbar-expand-md">
              <div className="navbar-header">
                  <span className="navbar-brand">Todo Manager</span>
              </div>
              <ul className="navbar-nav ml-auto">

                <li className="nav-item">
                  <span className="navbar-text">Logged in with {localStorage.getItem("email")}</span>
                </li>
                
                <li className="nav-item">
                  <Link className="nav-link btn btn-dark btn-sm" to="/" 
                    onClick={() => this.props.handleLogout()}>Logout</Link>
                </li>
              </ul>
            </nav>
        )
    }
}

export default NavBar