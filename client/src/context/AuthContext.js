import {createContext} from 'react'

function nothing() {}

export const AuthContext = createContext({
    isAuthenticated: false,
    verify: nothing,
    signOut: nothing
})