import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const authContext = useContext(AuthContext)

    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const signupHandler = async () => {
        try {
            const data = await request('/api/auth/signup', 'POST', {...form})
            if (data && data.token && data.userId) {
                authContext.signIn(data.token, data.userId)
            } else {
                message('Received invalid data form server')
            }
        } catch {
            // Error was handled in hook
        }
    }

    const signinHandler = async () => {
        try {
            const data = await request('/api/auth/signin', 'POST', {...form})
            if (data && data.token && data.userId) {
                authContext.signIn(data.token, data.userId)
            } else {
                message('Received invalid data form server')
            }
        } catch {
            // Error was handled in hook
        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Node-yt</h1>
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div style={{marginTop: 30}}>
                            <div className="input-field">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn yellow darken-4"
                            style={{marginRight: 10}}
                            onClick={signinHandler}
                            disabled={loading}
                        >
                            Sign In
                        </button>
                        <button
                            className="btn gray lighten-1 black-text"
                            onClick={signupHandler}
                            disabled={loading}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}