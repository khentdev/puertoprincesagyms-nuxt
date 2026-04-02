import type { GymV2 } from "../store"

export interface StaticMapOptions {
    width?: number
    height?: number
    zoom?: number
    markerColor?: string
    scale?: 1 | 2
    maptype?: "roadmap" | "satellite" | "terrain" | "hybrid"
}
export function generateStaticMapUrl(
    gym: GymV2,
    options: StaticMapOptions = {}
): string {
    const {
        width = MAPS_CONFIG.staticMap.defaultSize.width,
        height = MAPS_CONFIG.staticMap.defaultSize.height,
        zoom = MAPS_CONFIG.staticMap.defaultZoom,
        markerColor = MAPS_CONFIG.staticMap.markerColor,
        scale = 2,
        maptype = "hybrid",
    } = options

    const { lat, lng } = gym.location
    const markerLabel = encodeURIComponent(gym.name.charAt(0).toUpperCase())

    const params = new URLSearchParams({
        center: `${lat},${lng}`,
        zoom: zoom.toString(),
        size: `${width}x${height}`,
        maptype,
        markers: `color:${markerColor}|label:${markerLabel}|${lat},${lng}`,
        scale: scale.toString(),
        key: MAPS_CONFIG.apiKey,
    })

    return `${MAPS_CONFIG.staticMap.baseUrl}?${params.toString()}`
}

export function generateEmbedMapUrl(gym: GymV2): string {
    const { lat, lng } = gym.location
    return `https://maps.google.com/maps?q=${lat},${lng}&z=16&t=h&output=embed`
}
