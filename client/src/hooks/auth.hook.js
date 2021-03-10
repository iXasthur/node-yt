import {useState, useCallback, useEffect} from 'react'
import {useHttp} from "./http.hook";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [ready, setReady] = useState(false)

    const {request} = useHttp()

    const verify = useCallback(
        async () => {
            console.log('Verifying jwt')
            try {
                await request('/api/auth/verify')
                setIsAuthenticated(true)
            } catch {
                try {
                    await request('/api/auth/signout', 'POST') // remove local cookie
                } finally {
                    setIsAuthenticated(false)
                }
            }
        },
        [request]
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

    return {isAuthenticated, verify, ready}
}