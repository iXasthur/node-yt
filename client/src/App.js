import React from 'react'
import {BrowserRouter as Router} from "react-router-dom";
import {useRoutes} from "./routes";
import 'materialize-css'
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {NavBar} from "./components/NavBar";

function App() {
    const {token, userId, signIn, signOut} = useAuth()
    const isAuthenticated = !!token // cast to Boolean
    const routes = useRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{
            token,
            userId,
            isAuthenticated,
            signIn,
            signOut
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
