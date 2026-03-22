export default defineNuxtPlugin(() => {

    const runtimeConfig = useRuntimeConfig()
    const apiBase = runtimeConfig.public.apiBase

    const fetchApi = $fetch.create({
        baseURL: apiBase,
        credentials: "include",
        onRequest({ options }) {

            /**
             * I'll set the token logic in here
             * example: if(token) 
             * const headers = new Headers(options.headers as HeadersInit)
             * headers.set("Authorization", `Bearer ${token}`)
             * options.headers = headers
             */


        },
        onRequestError({ error }) {
            console.error('[Request Error]', error)
        },
        onResponseError({ error, response }) {
            /**
             * I'll handle request retry logic here
             */
            console.error('[Response Error]', response.status, error)
        }
    })

    return {
        provide: {
            fetchApi
        }
    }

})