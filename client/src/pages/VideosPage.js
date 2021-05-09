import React, {useState, useContext, useEffect} from 'react'
import {AppContext} from "../context/AppContext";
import {NavLink} from "react-router-dom";
import {LoaderScreenCentered} from "../components/LoaderScreenCentered";
import { getCookie } from '../utils/CookieAssistant';
import {FcDislike, FcLike} from "react-icons/all";

export const VideosPage = () => {
    const authContext = useContext(AppContext)

    const [isLoading, setIsLoading] = useState(true)
    const [videos, setVideos] = useState([])

    useEffect(() => {
        async function fetchVideos() {
            let jwt = getCookie('jwt')
            authContext.socket.emit('get_videos_list', {jwt})

            authContext.socket.on('get_videos_list_result', (data) => {
                setVideos(data.videos)
                setIsLoading(false)
            })
        }

        if (isLoading) {
            fetchVideos()
        }
    }, [isLoading])

    if (isLoading) {
        return (
            <LoaderScreenCentered />
        )
    }

    return (
        <div>
            <h2>Videos</h2>
            <div className="collection">
                {
                    videos.map(video => {
                        return(
                            <NavLink
                                key={video._id}
                                className="collection-item"
                                to={`/watch?id=${video._id}`}
                            >
                                {video.title}
                                <div className="secondary-content row">
                                    <div className="col"><FcDislike /></div>
                                    <div className="col">{video.dislikes.toString()}</div>
                                </div>
                                <div className="secondary-content row">
                                    <div className="col"><FcLike /></div>
                                    <div className="col">{video.likes.toString()}</div>
                                </div>
                            </NavLink>
                        )
                    })
                }
                <NavLink
                    key='length'
                    className="collection-item blue"
                    to={`#`}
                >
                    Count: {videos.length}
                </NavLink>
            </div>
        </div>


    )
}