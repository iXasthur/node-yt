import React from 'react'
import {useParams} from "react-router-dom";

export const VideoWatchPage = () => {

    const videoId = useParams().id
    const srcApiUrl = '/api/videos/file/' + videoId

    return (
        <div>
            <h1>Watch {videoId}</h1>
            <div className='watch-video-div'>
                <video controls='true' autoPlay='true'>
                    <source src={srcApiUrl} type='video/mp4' />
                </video>
            </div>
        </div>
    )
}