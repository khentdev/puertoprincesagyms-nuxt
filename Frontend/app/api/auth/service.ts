// Dummy
export const authService = {
    loginUser: async (params: LoginParams) => {
        return $fetch<LoginDTO>('/api/auth/login', {
            baseURL: useRuntimeConfig().public.apiBase,
            method: 'POST',
            body: params,
            credentials: 'include',
        })
    },
    getMe: async () => {
        const fetchApi = useApi()
        return fetchApi<User>('/api/auth/me')
    },
}