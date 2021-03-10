import React, {useContext} from 'react'
import {NavLink, useLocation} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";

export const NavBar = () => {
    const {request} = useHttp()

    const authContext = useContext(AuthContext)

    const logoutHandler = async (event) => {
        event.preventDefault()

        try {
            await request('/api/auth/signout', 'POST')
            authContext.verify()
        } catch (e) {
            console.log(e)
        }
    }

    let title = 'Node-yt'
    const location = useLocation().pathname
    switch (location) {
        case '/': {
            break
        }
        case '/auth': {
            break
        }
        case '/watch': {
            break
        }
        case '/upload': {
            break
        }
    }

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