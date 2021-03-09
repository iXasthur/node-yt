import React, {useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

export const VideosPage = () => {
    const authContext = useContext(AuthContext)

    const {loading, error, request, clearError} = useHttp()

    const videosHandler = async () => {
        try {
            await authContext.verify()
            const data = await request('/api/videos')
        } catch (e) {

        }
    }

    return (
        <div>
            <div className="card blue-grey darken-1">
                <div className="card-action">
                    <button
                        className="btn yellow darken-4"
                        style={{marginRight: 10}}
                        onClick={videosHandler}
                    >
                        list!!!
                    </button>
                </div>
            </div>
        </div>
    )
}