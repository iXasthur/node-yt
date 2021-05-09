import React, {useContext, useState, useEffect} from 'react'
import {useLocation} from "react-router-dom";
import {AppContext} from "../context/AppContext";
import {LoaderScreenCentered} from "../components/LoaderScreenCentered";
import {getCookie} from "../utils/CookieAssistant";

export const VideoWatchPage = () => {

    const query = new URLSearchParams(useLocation().search)

    const authContext = useContext(AppContext)

    const [isLoading, setIsLoading] = useState(true)
    const [videos, setVideos] = useState(null)

    useEffect(() => {
        async function fetchVideo() {
            const videoId = query.get('id')

            let jwt = getCookie('jwt')

            authContext.socket.emit('get_video', {jwt, videoId})

            authContext.socket.on('get_video_result', (data) => {
                setVideos(data.videos)
                setIsLoading(false)
            })
        }

        if (isLoading) {
            fetchVideo()
        }
    }, [isLoading, query])

    if (isLoading || videos.length < 1) {
        return (
            <LoaderScreenCentered />
        )
    }

    return (
        <div>
            <h1>Watch {videos[0].title}</h1>
            <div className='watch-video-div'>
                <video controls={true} autoPlay={true} >
                    <source src={'/api/videos/file/' + videos[0]._id} type='video/mp4' />
                </video>
            </div>
        </div>
    )
}