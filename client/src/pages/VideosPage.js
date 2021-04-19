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
            const query = `
                    query($qJwt: String!) {
                        videos(jwt: $qJwt) {
                            _id
                            title
                            fileName
                        }
                    }
                `;
            const variables = {qJwt: jwt};

            fetch('/graphql', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query,
                    variables
                }),
            })
                .then(res => res.json())
                .then(res => {
                    let data = res.data
                    if (data) {
                        let videos = data.videos
                        if (videos) {
                            setVideos(videos)
                            setIsLoading(false)
                        } else {
                            authContext.signOut()
                        }
                    } else {
                        authContext.signOut()
                    }
                });
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