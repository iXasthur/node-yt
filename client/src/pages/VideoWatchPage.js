import React, {useContext, useState, useEffect} from 'react'
import {useLocation} from "react-router-dom";
import {AppContext} from "../context/AppContext";
import {LoaderScreenCentered} from "../components/LoaderScreenCentered";
import {getCookie} from "../utils/CookieAssistant";
import {FcLike, RiDeleteBinLine} from "react-icons/all";

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
                if (data.videos) {
                    setVideos(data.videos)
                    setIsLoading(false)
                }
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

    const video = videos[0]

    return (
        <div>
            <h1>Watch {video.title}</h1>
            <div className="row">
                <div className="col"><FcLike /></div>
                <div className="col">{video.likes.toString()}</div>
            </div>
            <div className="row">
                <div className="secondary-content col"><RiDeleteBinLine /></div>
            </div>
            <div className='watch-video-div' style={({ marginBottom: '10rem', marginTop: '2rem' })}>
                <video controls={true} autoPlay={true} >
                    <source src={'/api/videos/file/' + video._id} type='video/mp4' />
                </video>
            </div>
        </div>
    )
}