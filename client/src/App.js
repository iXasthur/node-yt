import React from 'react'
import {BrowserRouter as Router} from "react-router-dom";
import {useRoutes} from "./routes";
import 'materialize-css'
import {AppContext} from "./context/AppContext";
import {NavBar} from "./components/NavBar";
import {LoaderScreenCentered} from "./components/LoaderScreenCentered";
import {useState, useEffect} from 'react'
import {useMessage} from "./hooks/message.hook";

require('isomorphic-fetch');

const ql = 'ql'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isReady, setIsReady] = useState(false)

    const message = useMessage()

    const restoreAuth = (jwt) => {
        const query = `
                    query($qJwt: String!) {
                        restore_auth(jwt: $qJwt) {
                            jwt
                            error
                        }
                    }
                `;
        const variables = { qJwt: jwt };

        fetch('/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query,
                variables
            }),
        })
            .then(res => res.json())
            .then(res => {
                const data = res.data
                handleAuthResult(data, 'restore_auth')
            });
    }

    const signUp = (email, password) => {
        const query = `
                    mutation($qEmail: String!, $qPassword: String!) {
                        sign_up(email: $qEmail, password: $qPassword) {
                            jwt
                            error
                        }
                    }
                `;
        const variables = { qEmail: email, qPassword: password };

        fetch('/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query,
                variables
            }),
        })
            .then(res => res.json())
            .then(res => {
                const data = res.data
                handleAuthResult(data, 'sign_up')
            });
    }

    const signIn = (email, password) => {
        const query = `
                    query($qEmail: String!, $qPassword: String!) {
                        sign_in(email: $qEmail, password: $qPassword) {
                            jwt
                            error
                        }
                    }
                `;
        const variables = { qEmail: email, qPassword: password };

        fetch('/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query,
                variables
            }),
        })
            .then(res => res.json())
            .then(res => {
                const data = res.data
                handleAuthResult(data, 'sign_in')
            });
    }

    const signOut = () => {
        eraseCookie('jwt')
        setIsAuthenticated(false)
    }

    const handleAuthResult = (data, path) => {
        if (JSON.stringify(data)) {
            let error = data[path].error
            if (error) {
                message(error)
            } else {
                let jwt = data[path].jwt
                if (jwt) {
                    setCookie('jwt', jwt, 1.0 / 24.0)
                    setIsAuthenticated(true)
                } else {
                    message('No jwt token received')
                }
            }
        } else {
            message('Invalid auth_result data')
        }
        setIsReady(true)
    }

    useEffect(() => {
        if (!isReady) {
            // restore authorization
            let jwt = getCookie('jwt')
            if (jwt != null) {
                restoreAuth(jwt)
            } else {
                setIsReady(true)
            }
        }
    }, [ql])

    const routes = useRoutes(isAuthenticated)

    return (
        <AppContext.Provider value={{
            isAuthenticated,
            signUp,
            signIn,
            signOut
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

function setCookie(name,value,days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0;i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export default App
