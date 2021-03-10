import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {VideosPage} from "./pages/VideosPage";
import {VideoUploadPage} from "./pages/VideoUploadPage";
import {VideoWatchPage} from "./pages/VideoWatchPage";
import {AuthPage} from "./pages/AuthPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path='/videos' exact>
                    <VideosPage/>
                </Route>
                <Route path='/upload' exact>
                    <VideoUploadPage/>
                </Route>
                <Route path='/watch' exact>
                    <VideoWatchPage/>
                </Route>
                <Redirect to='/videos'/>
            </Switch>
        )
    } else {
        return (
            <Switch>
                <Route path='/' exact>
                    <AuthPage/>
                </Route>
                <Redirect to='/'/>
            </Switch>
        )
    }
}