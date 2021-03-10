import {useState, useCallback, useEffect} from 'react'
import {useHttp} from "./http.hook";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [ready, setReady] = useState(false)

    const {request} = useHttp()

    const signOut = useCallback(
        async () => {
            try {
                await request('/api/auth/signout', 'POST') // remove cookie
            } finally {
                setIsAuthenticated(false)
            }
        },
        [request]
    )

    const verify = useCallback(
        async () => {
            console.log('Verifying jwt')
            try {
                await request('/api/auth/verify')
                setIsAuthenticated(true)
            } catch {
                await signOut()
            }
        },
        [request, signOut]
    )

    useEffect(
        () => {
            async function v() {
                await verify()
                setReady(true)
            }
            v()
        },
        [verify]
    )

    return {isAuthenticated, verify, signOut, ready}
}