import React, {useState, useContext} from 'react'
import {AppContext} from "../context/AppContext";

export const AuthPage = () => {
    const authContext = useContext(AppContext)
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const signupHandler = async () => {
        authContext.signUp(form.email, form.password)
    }

    const signinHandler = async () => {
        authContext.signIn(form.email, form.password)
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h2>Authorization</h2>
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
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
                            disabled={authContext.isLoading}
                        >
                            Sign In
                        </button>
                        <button
                            className="btn gray lighten-1 black-text"
                            onClick={signupHandler}
                            disabled={authContext.isLoading}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}