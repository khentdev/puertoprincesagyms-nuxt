// Dummy
export const useAuth = () => {
    const router = useRouter()

    // This is just example on how to use so I can remember
    const login = async (params: LoginParams) => {
        try {
            const res = await authService.loginUser(params)
            // handle success — store token, redirect, etc.
            await router.push('/dashboard')
            return res
        } catch (err) {
            // handle error — toast, log, etc.
            console.error('[Login Error]', err)
            throw err // re-throw if page needs to react to it
        }
    }

    const getMe = async () => {
        try {
            return await authService.getMe()
        } catch (err) {
            console.error('[GetMe Error]', err)
            throw err
        }
    }

    return { login, getMe }
}