import {createContext} from 'react'

function nothing() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    isAuthenticated: false,
    signIn: nothing,
    signOut: nothing
})