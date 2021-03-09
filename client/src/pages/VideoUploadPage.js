import React, {useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

export const VideoUploadPage = () => {
    const authContext = useContext(AuthContext)

    return (
        <div>
            <h1>Video Upload Page</h1>
        </div>
    )
}