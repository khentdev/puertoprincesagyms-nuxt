export const useApi = () => {
    const { $fetchApi } = useNuxtApp()
    return $fetchApi
}