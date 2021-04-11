import {createContext} from 'react'
import {Socket} from "socket.io-client";

function nothing() {}

export const AppContext = createContext({
    isAuthenticated: false,
    signUp: nothing,
    signIn: nothing,
    signOut: nothing,
    socket: Socket
})