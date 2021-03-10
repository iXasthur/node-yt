import React from 'react'
import {useLocation} from "react-router-dom";

export const VideoWatchPage = () => {

    const query = new URLSearchParams(useLocation().search)

    const videoId = query.get('id')
    const srcApiUrl = '/api/videos/file/' + videoId

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