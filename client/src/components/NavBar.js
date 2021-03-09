import React, {useContext} from 'react'
import {NavLink} from 'react-router-dom'
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