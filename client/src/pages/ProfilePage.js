import React, {useState, useContext, useEffect} from 'react'
import {AppContext} from "../context/AppContext";
import {LoaderScreenCentered} from "../components/LoaderScreenCentered";
import {getCookie} from "../utils/CookieAssistant";
import {NavLink} from "react-router-dom";
import {FcLike} from "react-icons/all";
import {Loader} from "../components/Loader";

export const ProfilePage = () => {
    const authContext = useContext(AppContext)

    const [isLoadingUploaded, setIsLoadingUploaded] = useState(true)
    const [isLoadingLiked, setIsLoadingLiked] = useState(true)

    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [uploadedVideos, setUploadedVideos] = useState([])
    const [likedVideos, setLikedVideos] = useState([])

    const getUploadedVideos = () => {
        setIsLoadingUploaded(true)

        let jwt = getCookie('jwt')
        authContext.socket.emit('get_uploaded_videos', {jwt})

        authContext.socket.on('get_uploaded_videos_result', (data) => {
            setUploadedVideos(data.videos)
            setIsLoadingUploaded(false)
        })
    }

    const getLikedVideos = () => {
        setIsLoadingLiked(true)

        let jwt = getCookie('jwt')
        authContext.socket.emit('get_liked_videos', {jwt})

        authContext.socket.on('get_liked_videos_result', (data) => {
            setLikedVideos(data.videos)
            setIsLoadingLiked(false)
        })
    }

    useEffect(() => {
        async function fetchUser() {
            let jwt = getCookie('jwt')
            authContext.socket.emit('get_user', {jwt})

            authContext.socket.on('get_user_result', (data) => {
                setUser(data.user)
                setIsLoading(false)

                getUploadedVideos()
                getLikedVideos()
            })
        }

        if (isLoading) {
            fetchUser()
        }
    }, [authContext])

    if (isLoading) {
        return (
            <LoaderScreenCentered />
        )
    }

    return (
        <div>
            <h2>{user.email}</h2>
            <h2>My videos</h2>
            {
                isLoadingUploaded
                    ? <div style={({display: "flex", flexDirection: "row", justifyContent: "center"})}><Loader/></div>
                    : <div className="collection">
                        {
                            uploadedVideos.map(video => {
                                return (
                                    <NavLink
                                        key={video._id}
                                        className="collection-item"
                                        to={`/watch?id=${video._id}`}
                                        onClick={(event) => video.isProcessing ? event.preventDefault() : null
                                        }
                                    >
                                        {video.title}
                                        {video.isProcessing ? ' (processing...)' : null}
                                        <div className="secondary-content row">
                                            <div className="col"><FcLike/></div>
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
                            onClick={(event) => event.preventDefault()}
                        >
                            Count: {uploadedVideos.length}
                        </NavLink>
                    </div>
            }

            <h2>Liked</h2>
            {
                isLoadingLiked
                    ? <div style={({display: "flex", flexDirection: "row", justifyContent: "center"})}><Loader/></div>
                    : <div className="collection">
                        {
                            likedVideos.map(video => {
                                return (
                                    <NavLink
                                        key={video._id}
                                        className="collection-item"
                                        to={`/watch?id=${video._id}`}
                                        onClick={(event) => video.isProcessing ? event.preventDefault() : null
                                        }
                                    >
                                        {video.title}
                                        {video.isProcessing ? ' (processing...)' : null}
                                        <div className="secondary-content row">
                                            <div className="col"><FcLike/></div>
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
                            onClick={(event) => event.preventDefault()}
                        >
                            Count: {likedVideos.length}
                        </NavLink>
                    </div>
            }
        </div>

    )
}