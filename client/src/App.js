import React from 'react'
import {BrowserRouter as Router} from "react-router-dom";
import {useRoutes} from "./routes";
import 'materialize-css'
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {NavBar} from "./components/NavBar";
import {Loader} from "./components/Loader";

function App() {
    const {isAuthenticated, verify, ready} = useAuth()

    const routes = useRoutes(isAuthenticated)

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            verify
        }}>
            <Router>
                <NavBar />
                { ready
                    ?
                        <div className="container">
                            {routes}
                        </div>
                    :
                        <div className='centered'>
                            <Loader />
                        </div>
                }
            </Router>
        </AuthContext.Provider>
    )
}

export default App
