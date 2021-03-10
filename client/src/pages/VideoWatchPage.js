import React, {useContext, useEffect, useState} from 'react'
import {useLocation} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {LoaderScreenCentered} from "../components/LoaderScreenCentered";

export const VideoWatchPage = () => {
    const authContext = useContext(AuthContext)
    const [verified, setVerified] = useState(false)

    const query = new URLSearchParams(useLocation().search)
    const videoId = query.get('id')
    const srcApiUrl = '/api/videos/file/' + videoId

    useEffect(() => {
        async function v() {
            await authContext.verify()
            setVerified(authContext.isAuthenticated)
        }
        v()
    }, [authContext])

    if (!verified) {
        return (
            <LoaderScreenCentered />
        )
    }

    return (
        <div>
            <h1>Watch {videoId}</h1>
            <div className='watch-video-div'>
                <video controls={true} autoPlay={true}>
                    <source src={srcApiUrl} type='video/mp4' />
                </video>
            </div>
        </div>
    )
}