import React, {useContext, useState, useRef} from 'react'
import {AuthContext} from "../context/AuthContext";
const Axios = require('axios');


export const VideoUploadPage = () => {
    const authContext = useContext(AuthContext)

    const [fileTitle, setFileTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const fileInputRef = React.useRef();

    const changeTitleHandler = (event) => {
        setFileTitle(event.target.value);
    };

    const changeFileHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setSelectedFileName(event.target.files[0].name);
    };

    const changeFileNameHandler = (event) => {
        setSelectedFileName(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault()

        const data = new FormData();
        data.append("title", fileTitle);
        data.append("video", selectedFile);

        Axios.post("/api/videos/upload", data)
            .then(res => console.log(res))
            .catch(err => console.log(err))

        setFileTitle('')
        setSelectedFile(null)
        setSelectedFileName('');
        fileInputRef.current.value = ""
    };

    return(
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Upload video</h1>
                <div className="card blue-grey darken-1">
                    <form action="#" onSubmit={handleSubmit}>
                        <div className="card-content white-text">
                            <div style={{marginTop: 30}}>
                                <div className="input-field">
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        autocomplete="off"
                                        value={fileTitle}
                                        onChange={changeTitleHandler}
                                        required
                                    />
                                    <label htmlFor="title">Title</label>
                                </div>
                            </div>
                        </div>
                        <div className="card-content file-field input-field">
                            <div className="btn">
                                <span>File</span>
                                <input
                                    type="file"
                                    accept=".mp4"
                                    ref={fileInputRef}
                                    onChange={changeFileHandler}
                                    required
                                />
                            </div>
                            <div className="file-path-wrapper">
                                <input
                                    className="file-path validate"
                                    type="text"
                                    value={selectedFileName}
                                    onChange={changeFileNameHandler}
                                    placeholder="Select file"
                                />
                            </div>
                        </div>
                        <div className="card-action">
                            <button
                                className="btn yellow darken-4"
                                style={{marginRight: 10}}
                                type="submit"
                            >
                                Upload
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}