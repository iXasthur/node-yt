import {useState, useCallback, useEffect} from 'react'
import {useHttp} from "./http.hook";

export const useVerify = () => {
    const [verified, setVerified] = useState(false)

    const {request} = useHttp()

    const verify = useCallback(
        async () => {
            try {
                await request('/api/auth/verify')
                setVerified(true)
            } catch {
                setVerified(false)
            }
        },
        [request]
    )

    useEffect(
        () => {
            verify()
        },
        [verify]
    )

    return {verified, verify}
}