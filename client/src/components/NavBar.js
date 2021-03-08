import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";

export const NavBar = () => {
    const history = useHistory()

    const authContext = useContext(AuthContext)

    const logoutHandler = (event) => {
        event.preventDefault()
        authContext.signOut()
        history.push('/')
    }

    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{ padding: '0 2rem' }}>
                <span className="brand-logo">Node-yt</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to={'/videos'}>Videos</NavLink></li>
                    <li><NavLink to={'/upload'}>Upload</NavLink></li>
                    <li><a href='/' onClick={logoutHandler}>Sign Out</a></li>
                </ul>
            </div>
        </nav>
    )
}