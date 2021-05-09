import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {VideosPage} from "./pages/VideosPage";
import {VideoUploadPage} from "./pages/VideoUploadPage";
import {VideoWatchPage} from "./pages/VideoWatchPage";
import {AuthPage} from "./pages/AuthPage";
import {ProfilePage} from "./pages/ProfilePage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path='/' exact>
                    <VideosPage/>
                </Route>
                <Route path='/profile' exact>
                    <ProfilePage/>
                </Route>
                <Route path='/upload' exact>
                    <VideoUploadPage/>
                </Route>
                <Route path='/watch' exact>
                    <VideoWatchPage/>
                </Route>
                <Redirect to='/'/>
            </Switch>
        )
    } else {
        return (
            <Switch>
                <Route path='/auth' exact>
                    <AuthPage/>
                </Route>
                <Redirect to='/auth'/>
            </Switch>
        )
    }
}