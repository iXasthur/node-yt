import React, {useState, useContext, useEffect} from 'react'
import {AppContext} from "../context/AppContext";
import {NavLink} from "react-router-dom";
import {LoaderScreenCentered} from "../components/LoaderScreenCentered";

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0;i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

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