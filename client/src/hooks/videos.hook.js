import {useState, useCallback, useEffect} from 'react'
import {useHttp} from "./http.hook";

export const useVideos = () => {
    const [videos, setVideos] = useState([])
    const [ready, setReady] = useState(false)

    const {request} = useHttp()

    const fetchVideos = useCallback(
        async () => {
            try {
                const data = await request('/api/videos')
                setVideos(data.videos || [])
            } catch (e) {
                console.log(e)
            }
        },
        [request]
    )

    useEffect(
        () => {
            async function f() {
                await fetchVideos()
                setReady(true)
            }
            f()
        },
        [fetchVideos]
    )

    return {videos, fetchVideos, ready}
}