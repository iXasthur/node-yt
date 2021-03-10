import React from 'react'
import {BrowserRouter as Router} from "react-router-dom";
import {useRoutes} from "./routes";
import 'materialize-css'
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {NavBar} from "./components/NavBar";
import {LoaderScreenCentered} from "./components/LoaderScreenCentered";

function App() {
    const {isAuthenticated, verify, signOut, ready} = useAuth()

    const routes = useRoutes(isAuthenticated)

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            verify,
            signOut
        }}>
            <Router>
                <NavBar />
                { ready
                    ?
                        <div className="container">
                            {routes}
                        </div>
                    :
                        <LoaderScreenCentered />
                }
            </Router>
        </AuthContext.Provider>
    )
}

export default App
