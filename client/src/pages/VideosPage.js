import React, {useContext, useEffect} from 'react'
import {AuthContext} from "../context/AuthContext";
import {NavLink} from "react-router-dom";
import {useVideos} from "../hooks/videos.hook";
import {LoaderScreenCentered} from "../components/LoaderScreenCentered";

export const VideosPage = () => {
    const authContext = useContext(AuthContext)

    const {videos, error, ready} = useVideos()

    useEffect(() => {
        if (error != null) {
            authContext.signOut()
        }
    }, [error, authContext])

    if (!ready || !!error) {
        return (
            <LoaderScreenCentered />
        )
    }

    return (
        <div className="collection" style={{marginTop: '5rem'}}>
            {
                videos.map(video => {
                    return(
                        <NavLink
                            key={video._id}
                            className="collection-item"
                            to={`/watch?id=${video._id}`}
                        >
                            {video.title}
                        </NavLink>
                    )
                })
            }
        </div>
    )
}