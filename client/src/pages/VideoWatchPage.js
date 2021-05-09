import React, {useContext, useState, useEffect} from 'react'
import {useHistory, useLocation} from "react-router-dom";
import {AppContext} from "../context/AppContext";
import {LoaderScreenCentered} from "../components/LoaderScreenCentered";
import {getCookie} from "../utils/CookieAssistant";
import {FcLike, RiDeleteBinLine} from "react-icons/all";

export const VideoWatchPage = () => {

    const history = useHistory();

    const query = new URLSearchParams(useLocation().search)

    const authContext = useContext(AppContext)

    const [likes, setLikes] = useState(-1)

    const [isLoading, setIsLoading] = useState(true)
    const [isLiking, setIsLiking] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [video, setVideo] = useState(null)

    const deleteVideo = () => {
        async function deleteAsync() {
            let jwt = getCookie('jwt')
            let id = video._id

            authContext.socket.emit('delete_video', {jwt, id})

            authContext.socket.on('delete_video_result', (data) => {
                history.push('/')
            })
        }

        if (!isDeleting) {
            setIsDeleting(true);
            deleteAsync()
        }
    }

    const likeVideo = () => {
        async function likeAsync() {
            let jwt = getCookie('jwt')
            let id = video._id

            authContext.socket.emit('video_like', {jwt, id})

            authContext.socket.on('video_like_result', (data) => {
                setLikes(data.likes)
                setIsLiking(false)
            })
        }

        if (!isLiking) {
            setIsLiking(true);
            likeAsync()
        }
    }

    useEffect(() => {
        async function fetchVideo() {
            const videoId = query.get('id')

            let jwt = getCookie('jwt')

            authContext.socket.emit('get_video', {jwt, videoId})

            authContext.socket.on('get_video_result', (data) => {
                if (data.videos) {
                    setLikes(data.videos[0].likes)
                    setVideo(data.videos[0])
                    setIsLoading(false)
                }
            })
        }

        if (isLoading) {
            fetchVideo()
        }
    }, [query])

    if (isLoading || isDeleting || !video) {
        return (
            <LoaderScreenCentered />
        )
    }

    return (
        <div>
            <h1>Watch {video.title}</h1>
            <div className="row">
                <div className="col" onClick={(e) => {
                    likeVideo()
                }}><FcLike /></div>
                <div className="col">{likes.toString()}</div>
            </div>
            <div className="row">
                <div className="secondary-content col" onClick={(e) => {
                    deleteVideo()
                }}><RiDeleteBinLine /></div>
            </div>
            <div className='watch-video-div' style={({ marginBottom: '10rem', marginTop: '2rem' })}>
                <video controls={true} autoPlay={true} >
                    <source src={'/api/videos/file/' + video._id} type='video/mp4' />
                </video>
            </div>
        </div>
    )
}