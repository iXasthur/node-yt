import React from 'react'
import {BrowserRouter as Router} from "react-router-dom";
import {useRoutes} from "./routes";
import 'materialize-css'
import {AppContext} from "./context/AppContext";
import {NavBar} from "./components/NavBar";
import {LoaderScreenCentered} from "./components/LoaderScreenCentered";
import {useState, useEffect} from 'react'
import {io} from "socket.io-client";
import {useMessage} from "./hooks/message.hook";
import { getCookie, eraseCookie, setCookie } from './utils/CookieAssistant';

const socket_p = 'socket';

function App() {
    const [socket, setSocket] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isReady, setIsReady] = useState(false)

    const message = useMessage()

    const signUp = (email, password) => {
        let data = {email, password}
        socket.emit('sign_up', data)
    }

    const signIn = (email, password) => {
        let data = {email, password}
        socket.emit('sign_in', data)
    }

    const signOut = () => {
        eraseCookie('jwt')
        setIsAuthenticated(false)
    }

    useEffect(() => {
        if (!isReady) {
            const socket = io('')
            setSocket(socket)

            // restore authorization
            let jwt = getCookie('jwt')
            if (jwt != null) {
                let data = {jwt}
                socket.emit('restore_auth', data)
            } else {
                setIsReady(true)
            }

            socket.on('auth_result', (data) => {
                if (JSON.stringify(data)) {
                    let error = data.error
                    if (error) {
                        message(error)
                    } else {
                        let jwt = data.jwt
                        if (jwt) {
                            setCookie('jwt', jwt, 1.0/24.0)
                            setIsAuthenticated(true)
                        } else {
                            message('No jwt token received')
                        }
                    }
                } else {
                    message('Invalid auth_result data')
                }
                setIsReady(true)
            })
        }
    }, [socket_p])

    const routes = useRoutes(isAuthenticated)

    return (
        <AppContext.Provider value={{
            isAuthenticated,
            signUp,
            signIn,
            signOut,
            socket
        }}>
            <Router>
                <NavBar />
                { isReady
                    ?
                        <div className="container">
                            {routes}
                        </div>
                    :
                        <LoaderScreenCentered />
                }
            </Router>
        </AppContext.Provider>
    )
}

export default App
