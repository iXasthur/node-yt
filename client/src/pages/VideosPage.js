import React, {useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {NavLink} from "react-router-dom";
import {useVideos} from "../hooks/videos.hook";
import {Loader} from "../components/Loader";

export const VideosPage = () => {
    const authContext = useContext(AuthContext)

    const {videos, ready} = useVideos()

    if (!ready) {
        return (
            <div className='centered'>
                <Loader />
            </div>
        )
    }

    return (
        <div className="collection" style={{marginTop: '5rem'}}>
            {
                videos.map(video => {
                    return(
                        <NavLink key={video._id} className="collection-item" to={`/watch?id=${video._id}`}>{video.title}</NavLink>
                    )
                })
            }
        </div>
    )
}