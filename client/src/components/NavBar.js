import React, {useContext} from 'react'
import {NavLink, useLocation} from 'react-router-dom'
import {AppContext} from "../context/AppContext";

export const NavBar = () => {
    const authContext = useContext(AppContext)

    const logoutHandler = async (event) => {
        event.preventDefault()
        authContext.signOut()
    }

    let title = 'Node-yt'
    const location = useLocation().pathname
    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{ padding: '0 2rem' }}>
                <span className="brand-logo"><NavLink to={'/'}>{title}</NavLink></span>
                { (location !== '/auth')
                    ?
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li style={ location === '/upload' ? {background: 'darkcyan'} : {}}><NavLink to={'/upload'}>Upload</NavLink></li>
                            <li><a href='/' onClick={logoutHandler}>Sign Out</a></li>
                        </ul>
                    :
                        <div />
                }
            </div>
        </nav>
    )
}