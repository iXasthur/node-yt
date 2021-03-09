import React from 'react'
import {BrowserRouter as Router} from "react-router-dom";
import {useRoutes} from "./routes";
import 'materialize-css'
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {NavBar} from "./components/NavBar";

function App() {
    const {isAuthenticated, verify, ready} = useAuth()

    const routes = useRoutes(isAuthenticated)

    if (!ready) {
        return (
            <div><h1>LOADER...</h1></div>
        )
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            verify
        }}>
            <Router>
                { isAuthenticated && <NavBar/> }
                <div className="container">
                    {routes}
                </div>
            </Router>
        </AuthContext.Provider>
    )
}

export default App
