import {createContext} from 'react'

function nothing() {}

export const AppContext = createContext({
    isAuthenticated: false,
    signUp: nothing,
    signIn: nothing,
    signOut: nothing
})