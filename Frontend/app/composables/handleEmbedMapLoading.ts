function handleEmbedMapLoading() {
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null

    const useFallback = ref(false)
    const isEmbedMapLoading = ref(true)

    const onEmbedLoad = () => {
        if (fallbackTimer) clearTimeout(fallbackTimer)
        isEmbedMapLoading.value = false
    }

    const EMBED_TIMEOUT_MS = 5000
    const startFallbackTimer = () => {
        fallbackTimer = setTimeout(() => {
            useFallback.value = true
            isEmbedMapLoading.value = false
        }, EMBED_TIMEOUT_MS)
    }

    if (!getCurrentInstance()) { console.error("handleEmbedMapLoading should be used inside a component."); return { isEmbedMapLoading, onEmbedLoad, startFallbackTimer, useFallback }; }

    onMounted(() => startFallbackTimer())
    onUnmounted(() => {
        if (fallbackTimer) clearTimeout(fallbackTimer)
    })

    return { isEmbedMapLoading, onEmbedLoad, useFallback }
}
export default handleEmbedMapLoading